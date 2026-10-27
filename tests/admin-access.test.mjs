import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import bcrypt from 'bcryptjs';
import { provisionAdmin, adminSetupErrorMessage } from '../scripts/admin-account.mjs';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : name === '@/lib/admin-allowlist' ? load('src/lib/admin-allowlist.ts') : require(name), exports);
  return exports;
}
const env = { ADMIN_EMAIL: 'Owner@Example.com ', ADMIN_PASSWORD: 'eight123', DATABASE_URL: 'postgresql://test', DEMO_MODE: 'false' };

test('approved admin enrollment supports single and multiple exact normalized emails', () => {
  const saved = { ...process.env };
  Object.assign(process.env, { ADMIN_EMAIL: ' Owner@example.com ', ADMIN_EMAILS: 'second@example.com, THIRD@example.com\nfourth@example.com' });
  const { isApprovedAdminEmail } = load('src/lib/admin-allowlist.ts');
  try {
    for (const email of ['owner@example.com', 'SECOND@example.com', 'third@example.com', 'fourth@example.com']) assert.equal(isApprovedAdminEmail(email), true);
    for (const email of ['someone@example.com', 'owner@example.com.evil.test', 'prefixowner@example.com']) assert.equal(isApprovedAdminEmail(email), false);
  } finally { process.env = saved; }
});

test('only approved email can request setup; it creates a passwordless owner and never promotes an existing user', async () => {
  const saved = { ...process.env }, originalFetch = globalThis.fetch;
  Object.assign(process.env, { ADMIN_EMAIL: 'owner@example.com', ADMIN_EMAILS: '', RESEND_API_KEY: 'test', RESEND_FROM_EMAIL: 'admin@example.com', NEXTAUTH_URL: 'https://example.com' });
  let created, body, existing = null, lookups = 0;
  const prisma = { user: { findFirst: async () => { lookups++; return existing; }, upsert: async ({ create, update }) => { assert.deepEqual(update, {}); created = create; return { id: 'owner', ...create }; } }, passwordResetToken: { findFirst: async () => null, create: async () => ({ id: 'token' }) } };
  globalThis.fetch = async (_url, options) => { body = JSON.parse(options.body); return { ok: true }; };
  const { sendPasswordReset } = load('src/lib/password-reset.ts', { '@/lib/prisma': { prisma } });
  try {
    const denied = await sendPasswordReset('unknown@example.com', true);
    assert.equal(lookups, 0); assert.equal(created, undefined);
    const approved = await sendPasswordReset(' OWNER@example.com ', true);
    assert.deepEqual(approved, denied);
    assert.deepEqual(created, { email: 'owner@example.com', role: 'OWNER' });
    assert.equal(body.text.includes('setup=1'), true);
    assert.equal(body.subject, 'Set up your website admin account');
    existing = { id: 'viewer', email: 'owner@example.com', role: 'VIEWER', password: 'hash' };
    created = undefined;
    await sendPasswordReset('owner@example.com', true);
    assert.equal(created, undefined); assert.equal(existing.role, 'VIEWER');
  } finally { process.env = saved; globalThis.fetch = originalFetch; }
});

test('pending enrollment needs a valid email token and current approval before setting a password', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, { ADMIN_EMAIL: 'owner@example.com', ADMIN_EMAILS: '' });
  let updated, approvedEmail = 'owner@example.com';
  const prisma = { user: { update: async ({ data }) => { updated = data; } }, passwordResetToken: { findUnique: async () => ({ id: 'token', userId: 'pending', usedAt: null, expiresAt: new Date(Date.now() + 60_000), user: { email: approvedEmail, password: null } }), updateMany: async () => ({ count: 1 }) }, $transaction: async (fn) => fn(prisma) };
  const { applyPasswordReset } = load('src/lib/password-reset.ts', { '@/lib/prisma': { prisma } });
  try {
    assert.equal((await applyPasswordReset('a'.repeat(64), 'eight123')).success, true);
    assert.equal(await bcrypt.compare('eight123', updated.password), true);
    assert.equal(updated.role, undefined);
    updated = undefined; approvedEmail = 'removed@example.com';
    assert.equal((await applyPasswordReset('a'.repeat(64), 'eight123')).success, false);
    assert.equal(updated, undefined);
  } finally { process.env = saved; }
});

test('account setup is publicly reachable without exposing protected admin routes', async () => {
  const { proxy } = load('src/proxy.ts', { 'next-auth/jwt': { getToken: async () => { assert.fail('setup must be public'); } }, '@/lib/prisma': { prisma: {} } });
  assert.equal((await proxy({ nextUrl: { pathname: '/admin/setup' }, url: 'https://example.com/admin/setup' })).status, 200);
});

test('admin diagnostics identify missing configuration and schema failures without exposing secrets', async () => {
  try {
    await provisionAdmin({}, { ...env, DATABASE_URL: '' });
    assert.fail('must refuse a missing database URL');
  } catch (error) { assert.match(adminSetupErrorMessage(error), /DATABASE_URL is missing/); }
  assert.match(adminSetupErrorMessage({ code: 'P2021', message: 'secret-db-url' }), /missing a required table/);
  assert.match(adminSetupErrorMessage({ errorCode: 'P1000', message: 'secret-password' }), /authentication failed/);
  assert.equal(adminSetupErrorMessage(new Error('secret-password')).includes('secret-password'), false);
});

test('admin provisioning creates a normalized owner with a hashed password and preserves existing accounts', async () => {
  let created;
  const prisma = { user: { findFirst: async () => null, create: async ({ data }) => { created = data; } } };
  await provisionAdmin(prisma, env);
  assert.equal(created.email, 'owner@example.com');
  assert.equal(created.role, 'OWNER');
  assert.notEqual(created.password, env.ADMIN_PASSWORD);
  assert.equal(await bcrypt.compare(env.ADMIN_PASSWORD, created.password), true);
  prisma.user.findFirst = async () => ({ id: 'user', role: 'EDITOR', password: 'old' });
  prisma.user.create = async () => assert.fail('must preserve existing account');
  assert.match(await provisionAdmin(prisma, env), /nothing changed/);
});

test('explicit admin reset updates only the selected account and revokes reset links', async () => {
  let updated, removed;
  const prisma = { user: { findFirst: async () => ({ id: 'owner' }), update: async (args) => { updated = args; } }, passwordResetToken: { deleteMany: async (args) => { removed = args; } }, $transaction: async (fn) => fn(prisma) };
  await provisionAdmin(prisma, env, { resetPassword: true });
  assert.equal(updated.where.id, 'owner');
  assert.equal(await bcrypt.compare(env.ADMIN_PASSWORD, updated.data.password), true);
  assert.deepEqual(removed.where, { userId: 'owner' });
});

test('admin check does not need a password or mutate the database; weak passwords are refused', async () => {
  const prisma = { user: { findFirst: async () => null } };
  assert.match(await provisionAdmin(prisma, { ...env, ADMIN_PASSWORD: undefined }, { check: true }), /No account/);
  await assert.rejects(provisionAdmin(prisma, { ...env, ADMIN_PASSWORD: 'seven12' }), /at least 8/);
  await assert.rejects(provisionAdmin(prisma, { ...env, ADMIN_PASSWORD: 'é'.repeat(37) }), /72 UTF-8/);
});

test('production login matches normalized email and database password without using env password', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  const password = await bcrypt.hash('database-password', 4);
  const { authOptions } = load('src/lib/auth.ts', { 'next-auth/providers/credentials': (options) => options, '@/lib/demo-password': { getDemoPassword: () => env.ADMIN_PASSWORD }, '@/lib/prisma': { prisma: { user: { findFirst: async ({ where }) => { assert.equal(where.email.equals, 'owner@example.com'); return { id: 'owner', email: 'Owner@Example.com', password, role: 'OWNER' }; } } } } });
  try {
    const authorize = authOptions.providers[0].authorize;
    assert.equal((await authorize({ email: ' OWNER@example.com ', password: 'database-password' })).id, 'owner');
    assert.equal(await authorize({ email: 'owner@example.com', password: env.ADMIN_PASSWORD }), null);
  } finally { process.env = saved; }
});

test('production login uses the database account even when bootstrap email and password are absent', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, { DEMO_MODE: 'false', DATABASE_URL: 'postgresql://test' });
  delete process.env.ADMIN_EMAIL; delete process.env.ADMIN_PASSWORD;
  const password = await bcrypt.hash('eight123', 4);
  const { authOptions } = load('src/lib/auth.ts', { 'next-auth/providers/credentials': (options) => options, '@/lib/demo-password': { getDemoPassword: () => { assert.fail('production must not read demo credentials'); } }, '@/lib/prisma': { prisma: { user: { findFirst: async () => ({ id: 'owner', email: 'owner@example.com', password, role: 'OWNER' }) } } } });
  try { assert.equal((await authOptions.providers[0].authorize({ email: 'owner@example.com', password: 'eight123' })).role, 'OWNER'); }
  finally { process.env = saved; }
});

test('admin check identifies when editing env has not changed the stored password', async () => {
  const password = await bcrypt.hash('database-only', 4);
  const prisma = { user: { findFirst: async () => ({ id: 'owner', role: 'OWNER', password }) } };
  assert.match(await provisionAdmin(prisma, env, { check: true }), /matches database: NO/);
  assert.match(await provisionAdmin(prisma, { ...env, ADMIN_PASSWORD: 'database-only' }, { check: true }), /matches database: yes/);
});

test('recovery stores only a token hash, emails stored account address, and hides unknown accounts', async () => {
  const saved = { ...process.env }, originalFetch = globalThis.fetch;
  Object.assign(process.env, { RESEND_API_KEY: 'test', RESEND_FROM_EMAIL: 'Admin <admin@example.com>', NEXTAUTH_URL: 'https://example.com', BUSINESS_EMAIL: '' });
  let stored, body, account = { id: 'owner', email: 'Owner@example.com' };
  const prisma = { user: { findFirst: async () => account }, passwordResetToken: { findFirst: async () => null, create: async ({ data }) => { stored = data; return { id: 'token' }; } } };
  globalThis.fetch = async (_url, options) => { body = JSON.parse(options.body); return { ok: true }; };
  const { sendPasswordReset } = load('src/lib/password-reset.ts', { '@/lib/prisma': { prisma } });
  try {
    const result = await sendPasswordReset('owner@example.com');
    const rawToken = body.text.match(/token=([a-f0-9]{64})/)[1];
    assert.equal(stored.tokenHash, createHash('sha256').update(rawToken).digest('hex'));
    assert.deepEqual(body.to, ['Owner@example.com']);
    assert.equal(JSON.stringify(result).includes(rawToken), false);
    assert.ok(stored.expiresAt.getTime() > Date.now() + 29 * 60_000);
    account = null;
    assert.deepEqual(await sendPasswordReset('missing@example.com'), result);
  } finally { process.env = saved; globalThis.fetch = originalFetch; }
});

test('recovery rejects provider failures and respects account cooldown without exposing either', async () => {
  const saved = { ...process.env }, originalFetch = globalThis.fetch, originalError = console.error;
  Object.assign(process.env, { RESEND_API_KEY: 'test', RESEND_FROM_EMAIL: 'admin@example.com', NEXTAUTH_URL: 'https://example.com' });
  let recent = null, deleted = false, sent = 0;
  const prisma = { user: { findFirst: async () => ({ id: 'owner', email: 'owner@example.com' }) }, passwordResetToken: { findFirst: async () => recent, create: async () => ({ id: 'failed' }), deleteMany: async () => { deleted = true; } } };
  globalThis.fetch = async () => { sent++; return { ok: false }; }; console.error = () => {};
  const { sendPasswordReset } = load('src/lib/password-reset.ts', { '@/lib/prisma': { prisma } });
  try {
    const result = await sendPasswordReset('owner@example.com');
    assert.equal(deleted, true);
    recent = { id: 'recent' };
    assert.deepEqual(await sendPasswordReset('owner@example.com'), result);
    assert.equal(sent, 1);
  } finally { process.env = saved; globalThis.fetch = originalFetch; console.error = originalError; }
});

test('reset requires an unexpired unused token, claims once, and invalidates other links', async () => {
  let record = { id: 'token', userId: 'owner', user: { email: 'owner@example.com', password: 'existing-hash' }, usedAt: null, expiresAt: new Date(Date.now() + 60_000) }, writes = 0, claimed = 1, invalidated = false;
  const prisma = { user: { update: async ({ data }) => { writes++; assert.equal(await bcrypt.compare(' padded-password ', data.password), true); } }, passwordResetToken: { findUnique: async () => record, updateMany: async ({ where }) => { if (where.id) return { count: claimed }; invalidated = true; return { count: 2 }; } }, $transaction: async (fn) => fn(prisma) };
  const { applyPasswordReset } = load('src/lib/password-reset.ts', { '@/lib/prisma': { prisma } });
  assert.equal((await applyPasswordReset('bad', ' padded-password ')).success, false);
  assert.equal((await applyPasswordReset('a'.repeat(64), ' padded-password ')).success, true);
  assert.equal(invalidated, true); assert.equal(writes, 1);
  claimed = 0;
  assert.equal((await applyPasswordReset('a'.repeat(64), ' padded-password ')).success, false);
  record = { ...record, expiresAt: new Date(0) };
  assert.equal((await applyPasswordReset('a'.repeat(64), ' padded-password ')).success, false);
  record = { ...record, expiresAt: new Date(Date.now() + 60_000), usedAt: new Date() };
  assert.equal((await applyPasswordReset('a'.repeat(64), ' padded-password ')).success, false);
  assert.equal(writes, 1);
});
