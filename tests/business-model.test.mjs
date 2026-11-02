import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
const home = JSON.parse(readFileSync(new URL('../src/data/homepage.json', import.meta.url)));
const defaults = JSON.parse(readFileSync(new URL('../src/data/page-defaults.json', import.meta.url)));
const Link = ({ href, children, ...props }) => createElement('a', { ...props, href }, children);

test('older homepage snapshots retain their section choices and accept the extended CMS schema', () => {
  const { homeSchema } = load('src/lib/home-content.ts', { '@/data/homepage.json': home });
  const legacy = structuredClone(home);
  delete legacy.audiences;
  delete legacy.hero.eyebrow;
  delete legacy.hero.portraitCaption;
  delete legacy.pillars.serviceSlugs;
  legacy.sections = ['hero', 'pillars', 'faq'];
  const parsed = homeSchema.parse(legacy);
  assert.deepEqual(parsed.sections, legacy.sections);
  assert.equal(parsed.pillars.serviceSlugs, undefined);
  assert.equal(parsed.hero.title, legacy.hero.title);
  assert.equal(homeSchema.safeParse({ ...home, audiences: { ...home.audiences, items: [{ ...home.audiences.items[0], href: '/\\evil.example' }] } }).success, false);
  assert.equal(homeSchema.safeParse({ ...home, pillars: { ...home.pillars, serviceSlugs: ['same', 'same'] } }).success, false);
});

test('homepage service selections retain order and never restore missing or intentionally empty services', async () => {
  const { default: Pillars } = load('src/components/home/ServicePillars.tsx', {
    'next/link': Link,
    '@/lib/services': { getManagedServices: async () => [
      { slug: 'one', title: 'First published', shortDescription: 'First service' },
      { slug: 'two', title: 'Second published', shortDescription: 'Second service' },
    ] },
  });
  const html = renderToStaticMarkup(await Pillars({ content: { title: 'Capabilities', subheadline: 'Help', serviceSlugs: ['two', 'private', 'one'] } }));
  assert.ok(html.indexOf('Second published') < html.indexOf('First published'));
  assert.ok(!html.includes('/services/private'));
  const empty = renderToStaticMarkup(await Pillars({ content: { title: 'Capabilities', subheadline: 'Help', serviceSlugs: [] } }));
  assert.ok(!empty.includes('First published'));
  assert.ok(!empty.includes('Second published'));
});

test('customer path renderer uses editable cards, support scope, and conversion links', async () => {
  const content = { ...defaults['for-businesses'], title: 'Published business journey', items: [{ title: 'Managed CMS card', description: 'Customer-defined service scope', cta: 'Discuss this work', href: '/contact?offer=website-care' }], ongoingDescription: 'Agreed monthly capacity, no unlimited changes.' };
  const { default: Page } = load('src/components/AudiencePage.tsx', {
    'next/link': Link,
    '@/components/ManagedPageCTA': () => null,
    '@/components/admin/PagePreviewBanner': () => null,
    '@/lib/managed-pages': { getManagedPageContent: async (slug) => { assert.equal(slug, 'for-businesses'); return content; } },
  });
  const html = renderToStaticMarkup(await Page({ slug: 'for-businesses' }));
  assert.ok(html.includes('Published business journey'));
  assert.ok(html.includes('Managed CMS card'));
  assert.ok(html.includes('href="/contact?offer=website-care"'));
  assert.ok(html.includes(content.ongoingDescription));
  assert.ok(!html.includes('Build your digital presence'));
});

test('new audience-page cards reject unsafe destinations and allow editorial removal', () => {
  const { parsePageContent } = load('src/lib/page-content-schema.ts', { '@/data/page-defaults.json': defaults });
  for (const slug of ['for-businesses', 'for-founders']) {
    const content = defaults[slug];
    assert.equal(parsePageContent(slug, { ...content, items: [] }).success, true);
    assert.equal(parsePageContent(slug, { ...content, items: [{ ...content.items[0], href: 'javascript:alert(1)' }] }).success, false);
  }
});
