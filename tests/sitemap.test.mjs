import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}

test('sitemap lists unique www canonical public URLs with real modification dates', async () => {
  const modified = new Date('2026-10-01T10:00:00Z');
  const sitemap = load('src/app/sitemap.ts', {
    '@/lib/content': { getPublicBlogPosts: async () => [{ slug: 'published-article', publishedAt: '2025-01-01', updatedAt: modified.toISOString() }] },
    '@/lib/case-studies': { getCaseStudies: async () => [{ slug: 'real-case', updatedAt: modified }, { slug: 'fallback-case', updatedAt: new Date(0) }] },
    '@/lib/services': { getManagedServices: async () => [{ slug: 'published-service', updatedAt: modified }, { slug: 'published-service', updatedAt: modified }, { slug: 'fallback-service' }] },
  });
  const result = await sitemap.default();
  const urls = result.map((item) => item.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://www.ojomoefosa.com/videos'));
  for (const url of urls) {
    assert.equal(new URL(url).origin, 'https://www.ojomoefosa.com');
    assert.ok(!/\/(admin|api|cv|docs|consulting|pricing)(\/|$)/.test(new URL(url).pathname));
    assert.equal(new URL(url).search, '');
  }
  assert.equal(result.find((item) => item.url.endsWith('/published-service')).lastModified.toISOString(), modified.toISOString());
  assert.equal(result.find((item) => item.url.endsWith('/published-article')).lastModified.toISOString(), modified.toISOString());
  for (const suffix of ['', '/fallback-case', '/fallback-service']) {
    const item = suffix ? result.find((item) => item.url.endsWith(suffix)) : result.find((item) => item.url === 'https://www.ojomoefosa.com');
    assert.equal(item.lastModified, undefined);
  }
  assert.deepEqual(await sitemap.default(), result, 'unchanged content must not receive a synthetic current timestamp');
});

test('legacy consulting URLs and service aliases permanently consolidate into current services', async () => {
  const consulting = JSON.parse(readFileSync(new URL('../src/data/consulting.json', import.meta.url)));
  const services = load('src/data/services.ts', { './consulting.json': consulting });
  const landings = load('src/data/landing-pages.ts');
  const { default: config } = load('next.config.ts', { './src/data/services': services, './src/data/landing-pages': landings });
  const redirects = await config.redirects();
  for (const [slug, current] of Object.entries(services.serviceAliases)) {
    assert.deepEqual(redirects.find((rule) => rule.source === `/services/${slug}`), { source: `/services/${slug}`, destination: `/services/${current}`, permanent: true });
  }
  for (const [slug, page] of Object.entries(landings.landingPages)) {
    const rule = redirects.find((rule) => rule.source === `/consulting/${slug}`);
    assert.equal(rule.permanent, true);
    assert.equal(rule.destination, `/services/${services.serviceAliases[page.service] ?? page.service}`);
  }
});
