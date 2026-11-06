import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : name === '@/lib/admin-session-settings' ? { getAdminIdleTimeoutMinutes: async () => 60 } : require(name), exports);
  return exports;
}
const policy = load('src/lib/admin-session.ts');
const { ADMIN_IDLE_TIMEOUT_MS: hour, adminSessionExpired } = policy;
const { createAdminIdleTimer } = load('src/lib/admin-idle-timer.ts', { '@/lib/admin-session': policy });

function clock() {
  let time = 10_000, callback, due, shared = NaN, expirations = 0;
  const timer = createAdminIdleTimer({ lastActivity: time, now: () => time, readSharedActivity: () => shared, onExpire: () => expirations++, schedule: (fn, delay) => { callback = fn; due = time + delay; return 1; }, cancel: () => {} });
  return { timer, advance(ms, run = true) { time += ms; if (run && time >= due) callback(); }, share(at) { shared = at; }, now: () => time, expired: () => expirations };
}

test('exactly one idle hour expires once, and a late activity cannot revive the portal', () => {
  const c = clock(); c.advance(hour - 1); assert.equal(c.expired(), 0);
  c.advance(1); assert.equal(c.expired(), 1);
  assert.equal(c.timer.activity(), false); c.timer.check(); assert.equal(c.expired(), 1);
});

test('real activity extends the idle deadline beyond the original sign-in hour', () => {
  const c = clock(); c.advance(hour - 1_000); assert.equal(c.timer.activity(), true);
  c.advance(2_000); assert.equal(c.expired(), 0);
  c.advance(hour - 2_000); assert.equal(c.expired(), 1);
});

test('wake/focus checks expire suspended tabs before accepting new activity', () => {
  const c = clock(); c.advance(hour + 100, false);
  assert.equal(c.timer.activity(), false); assert.equal(c.expired(), 1);
});

test('activity in another tab extends the deadline, while future timestamps are ignored', () => {
  const c = clock(); c.advance(hour - 1_000); c.share(c.now());
  c.advance(2_000); assert.equal(c.expired(), 0);
  c.share(c.now() + hour * 10); c.advance(hour - 2_000); assert.equal(c.expired(), 1);
});

test('unmount cancels expiry and missing/invalid server activity is rejected', () => {
  const c = clock(); c.timer.stop(); c.advance(hour * 2); assert.equal(c.expired(), 0);
  for (const value of [undefined, NaN, Infinity, '100', hour * 10]) assert.equal(adminSessionExpired({ lastActivityAt: value }, 100), true);
});

const auth = load('src/lib/auth.ts', {
  '@/lib/admin-session': policy,
  'next-auth/providers/credentials': (options) => options,
  '@/lib/demo-password': {}, '@/lib/prisma': { prisma: {} },
}).authOptions;

test('server rejects expired sessions even after update requests and background reads', async () => {
  const originalNow = Date.now; const originalDemo = process.env.DEMO_MODE;
  let now = 100_000; Date.now = () => now; process.env.DEMO_MODE = 'true';
  try {
    const jwt = auth.callbacks.jwt;
    let token = await jwt({ token: { sub: 'owner' }, user: { role: 'OWNER' } });
    now += hour - 1;
    const unchanged = await jwt({ token: { ...token } });
    assert.equal(unchanged.lastActivityAt, 100_000, 'session polling is not activity');
    token = await jwt({ token, trigger: 'update', session: { lastActivityAt: now + hour * 10 } });
    assert.equal(token.lastActivityAt, now, 'client timestamps are ignored');
    now += hour;
    assert.deepEqual(await jwt({ token, trigger: 'update' }), {}, 'expired sessions cannot renew');
    const session = await auth.callbacks.session({ session: { user: { email: 'owner@example.com' }, expires: 'future' }, token });
    assert.equal(session.user, undefined);
    const active = await auth.callbacks.session({ session: { user: { email: 'owner@example.com' }, expires: 'future' }, token: { sub: 'owner', role: 'OWNER', lastActivityAt: now } });
    assert.equal(active.user.role, 'OWNER'); assert.equal(active.idleExpiresAt, now + hour);
    assert.equal(auth.session.maxAge, 86400); assert.equal(auth.jwt.maxAge, 86400);
  } finally { Date.now = originalNow; if (originalDemo === undefined) delete process.env.DEMO_MODE; else process.env.DEMO_MODE = originalDemo; }
});

test('expired JWTs cannot reach protected admin pages, while recovery remains public', async () => {
  const originalDemo = process.env.DEMO_MODE; process.env.DEMO_MODE = 'true';
  let token = { email: 'owner@example.com', lastActivityAt: Date.now() - hour };
  const { proxy } = load('src/proxy.ts', { '@/lib/admin-session': policy, '@/lib/prisma': { prisma: {} }, 'next-auth/jwt': { getToken: async () => token } });
  const request = (path) => ({ nextUrl: { pathname: path }, url: `https://example.com${path}` });
  try {
    const response = await proxy(request('/admin/blog'));
    assert.equal(response.status, 307); assert.match(response.headers.get('location'), /reason=idle/);
    token = { ...token, lastActivityAt: Date.now() };
    assert.equal((await proxy(request('/admin/blog'))).status, 200);
    assert.equal((await proxy(request('/admin/forgot-password'))).status, 200);
  } finally { if (originalDemo === undefined) delete process.env.DEMO_MODE; else process.env.DEMO_MODE = originalDemo; }
});
