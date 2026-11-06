import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/database-url.ts', import.meta.url), 'utf8');
const exports = {};
new Function('exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(exports);
const { runtimeDatabaseUrl } = exports;

test('older Prisma integrations use the managed pooler with the same credentials and TLS options', () => {
  const env = { DATABASE_URL: 'postgres://user:pass%40word@db.prisma.io:5432/postgres?sslmode=require', VERCEL: '1' };
  const url = new URL(runtimeDatabaseUrl(env));
  assert.equal(url.hostname, 'pooled.db.prisma.io');
  assert.equal(url.username, 'user');
  assert.equal(url.password, 'pass%40word');
  assert.equal(url.pathname, '/postgres');
  assert.equal(url.searchParams.get('sslmode'), 'require');
  assert.equal(url.searchParams.get('connection_limit'), '1');
  assert.equal(url.searchParams.get('connect_timeout'), '15');
  assert.equal(new URL(env.DATABASE_URL).hostname, 'db.prisma.io');
});

test('an explicit pooled connection wins and existing pool settings are respected', () => {
  const url = new URL(runtimeDatabaseUrl({ DATABASE_URL: 'postgres://direct.example/db', DATABASE_URL_POOLED: 'postgres://pool.example/custom?connection_limit=3&connect_timeout=20&pool_timeout=30', VERCEL: '1' }));
  assert.equal(url.hostname, 'pool.example');
  assert.equal(url.pathname, '/custom');
  assert.equal(url.searchParams.get('connection_limit'), '3');
  assert.equal(url.searchParams.get('connect_timeout'), '20');
  assert.equal(url.searchParams.get('pool_timeout'), '30');
});

test('other providers, local settings, and Accelerate URLs retain their connection destination', () => {
  assert.equal(runtimeDatabaseUrl({}), undefined);
  const local = 'postgresql://user:password@localhost:5432/local?schema=public';
  assert.equal(runtimeDatabaseUrl({ DATABASE_URL: local }), local);
  const accelerate = 'prisma+postgres://accelerate.prisma-data.net/?api_key=test';
  assert.equal(runtimeDatabaseUrl({ DATABASE_URL: accelerate, VERCEL: '1' }), accelerate);
  assert.equal(runtimeDatabaseUrl({ DATABASE_URL: 'invalid' }), 'invalid');
});
