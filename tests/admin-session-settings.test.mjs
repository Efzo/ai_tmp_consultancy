import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const exports = {};
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
const policy = load('src/lib/admin-session.ts');

test('saved timeout settings retain valid custom values and fail closed on database errors', async () => {
  const saved = { ...process.env }; Object.assign(process.env, { DEMO_MODE: 'false', DATABASE_URL: 'postgresql://test' });
  let value = null, fail = false;
  const settings = load('src/lib/admin-session-settings.ts', { '@/lib/admin-session': policy, '@/lib/prisma': { prisma: { siteSetting: { findUnique: async () => { if (fail) throw new Error('private-connection-string'); return value === null ? null : { value }; } } } } });
  try {
    assert.equal(await settings.getAdminIdleTimeoutMinutes(), 60);
    for (const minutes of [5, 30, 60, 90, 120, 1440]) { value = minutes; assert.equal(await settings.getAdminIdleTimeoutMinutes(), minutes); }
    for (const invalid of [0, 4, 1441, 30.5, '30', Infinity, {}, null]) { value = invalid; assert.equal(await settings.getAdminIdleTimeoutMinutes(), 60); }
    fail = true; await assert.rejects(settings.getAdminIdleTimeoutMinutes(), (error) => error.message.includes('could not be loaded') && !error.message.includes('private'));
  } finally { process.env = saved; }
});

test('only owners can save validated timeout settings, atomically with the audit record', async () => {
  const saved = { ...process.env }; Object.assign(process.env, { DEMO_MODE: 'false', DATABASE_URL: 'postgresql://test' });
  let role = 'OWNER', value = 60, audits = 0, fail = false, writes = 0; const refreshed = [];
  const db = { $transaction: async (callback) => {
    let pending;
    await callback({ siteSetting: { upsert: async ({ create }) => { writes++; pending = create.value; } }, auditEvent: { create: async ({ data }) => { assert.equal(data.actorId, 'owner'); if (fail) throw new Error('offline'); } } });
    value = pending; audits++;
  } };
  const action = load('src/app/actions/admin-session.ts', { 'next-auth': { getServerSession: async () => ({ user: { id: 'owner', role } }) }, '@/lib/auth': {}, '@/lib/prisma': { prisma: db }, '@/lib/admin-session': policy, '@/lib/admin-session-settings': { adminIdleSettingKey: 'security.adminIdleTimeoutMinutes' }, 'next/cache': { revalidatePath: (path) => refreshed.push(path) } });
  try {
    for (const minutes of [30, 120, 90]) { const result = await action.updateAdminIdleTimeoutMinutes(minutes); assert.equal(result.success, true); assert.equal(value, minutes); assert.match(result.message, /New sign-ins/); }
    assert.equal(audits, 3); assert.ok(refreshed.includes('/admin/security'));
    const before = writes;
    for (const invalid of [0, 4, 1441, 15.5, '120', null]) assert.equal((await action.updateAdminIdleTimeoutMinutes(invalid)).success, false);
    assert.equal(writes, before);
    for (role of ['EDITOR', 'VIEWER', undefined]) await assert.rejects(action.updateAdminIdleTimeoutMinutes(60), /Only the owner/);
    assert.equal(writes, before);
    role = 'OWNER'; fail = true; assert.equal((await action.updateAdminIdleTimeoutMinutes(120)).success, false); assert.equal(value, 90); assert.equal(audits, 3);
    process.env.DEMO_MODE = 'true'; assert.equal((await action.updateAdminIdleTimeoutMinutes(30)).success, false);
  } finally { process.env = saved; }
});

test('the chosen duration is signed into new sessions and cannot be changed by client activity payloads', async () => {
  const saved = { ...process.env }; process.env.DEMO_MODE = 'true';
  let configured = 30, reads = 0;
  const auth = load('src/lib/auth.ts', { '@/lib/admin-session': policy, '@/lib/admin-session-settings': { getAdminIdleTimeoutMinutes: async () => { reads++; return configured; } }, 'next-auth/providers/credentials': (options) => options, '@/lib/prisma': { prisma: {} }, '@/lib/demo-password': {} }).authOptions;
  try {
    const first = await auth.callbacks.jwt({ token: { sub: 'owner' }, user: { role: 'OWNER' } });
    assert.equal(first.idleTimeoutMinutes, 30);
    configured = 120;
    const second = await auth.callbacks.jwt({ token: { sub: 'owner' }, user: { role: 'OWNER' } });
    assert.equal(second.idleTimeoutMinutes, 120);
    const updated = await auth.callbacks.jwt({ token: first, trigger: 'update', session: { idleTimeoutMinutes: 1440 } });
    assert.equal(updated.idleTimeoutMinutes, 30); assert.equal(reads, 2, 'active sessions retain their signed policy');
    const session = await auth.callbacks.session({ session: { user: { email: 'owner@example.com' }, expires: 'future' }, token: second });
    assert.equal(session.idleTimeoutMinutes, 120);
    assert.equal(session.idleExpiresAt, second.lastActivityAt + 120 * 60_000);
    assert.equal(policy.adminSessionExpired(second, second.lastActivityAt + 60 * 60_000), false);
    assert.equal(policy.adminSessionExpired(second, second.lastActivityAt + 120 * 60_000), true);
    assert.equal(policy.adminSessionExpired(first, first.lastActivityAt + 30 * 60_000), true);
    assert.equal(auth.session.maxAge, 86400);
  } finally { process.env = saved; }
});

test('browser timers honor 30-minute and two-hour session policies', () => {
  const { createAdminIdleTimer } = load('src/lib/admin-idle-timer.ts', { '@/lib/admin-session': policy });
  for (const minutes of [30, 120]) {
    let now = 10_000, expired = 0, callback;
    const timeoutMs = policy.adminIdleTimeoutMs(minutes);
    const timer = createAdminIdleTimer({ lastActivity: now, timeoutMs, now: () => now, onExpire: () => expired++, readSharedActivity: () => NaN, schedule: (fn, delay) => { callback = fn; assert.equal(delay, timeoutMs); return 1; }, cancel() {} });
    now += timeoutMs; callback(); assert.equal(expired, 1); assert.equal(timer.activity(), false);
  }
});

test('Security Settings presents presets, a custom range, and owner-only editing', () => {
  const Editor = load('src/components/admin/AdminIdleTimeoutEditor.tsx', { '@/lib/admin-session': policy, '@/app/actions/admin-session': { updateAdminIdleTimeoutMinutes: async () => ({ success: true }) } }).default;
  const html = renderToStaticMarkup(createElement(Editor, { minutes: 90, canEdit: true }));
  for (const label of ['30 minutes', '1 hour (default)', '2 hours', 'Custom duration', 'Custom duration in minutes', 'next time']) assert.ok(html.includes(label), label);
  assert.match(html, /min="5"/); assert.match(html, /max="1440"/); assert.match(html, /value="90"/);
  const readonly = renderToStaticMarkup(createElement(Editor, { minutes: 60, canEdit: false }));
  assert.match(readonly, /fieldset disabled/); assert.match(readonly, /Only the owner/);
});
