import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const seo = {};
new Function('exports', js)(seo);

test('long page descriptions use the same concise snippet in search and social metadata', () => {
  const long = 'Build your digital presence, manage your product, improve customer support systems, and automate repetitive work. Start with a defined project and add ongoing care where you need it.';
  const metadata = seo.pageMetadata('Technology services', long, '/services');
  assert.ok(metadata.description.length <= 160);
  assert.ok(metadata.description.endsWith('…'));
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.twitter.description, metadata.description);
  assert.equal(metadata.alternates.canonical, '/services');
  assert.equal(metadata.title, 'Technology services | Efosa Ojomo');
});

test('short descriptions retain wording and normalise editorial whitespace', () => {
  assert.equal(seo.searchDescription('  Practical technology\n for your business.  '), 'Practical technology for your business.');
  assert.equal(seo.searchDescription('x'.repeat(200)).length, 158);
});
