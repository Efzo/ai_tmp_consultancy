import assert from 'node:assert/strict';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3100';
const origin = 'https://www.ojomoefosa.com';
const response = await fetch(base + '/sitemap.xml');
assert.equal(response.status, 200);
const xml = await response.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length > 0);
assert.equal(new Set(urls).size, urls.length);
for (const url of urls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, origin);
  assert.ok(!/^\/(admin|api|cv|docs|consulting|pricing)(\/|$)/.test(parsed.pathname));
  assert.equal(parsed.search, '');
  const page = await fetch(base + parsed.pathname, { redirect: 'manual' });
  assert.equal(page.status, 200, `${url}: sitemap must contain successful canonical pages`);
  const html = await page.text();
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), url);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, `${url}: canonical tag required`);
  assert.equal(canonical[1].replace(/\/$/, ''), url.replace(/\/$/, ''));
}
for (const [path, destination] of [
  ['/services/ai-strategy', '/services/ai-solutions'],
  ['/services/fractional-tpm', '/services/technical-product-management'],
  ['/consulting/ai-product-consulting', '/services/ai-solutions'],
  ['/consulting/fractional-technical-product-manager', '/services/technical-product-management'],
  ['/consulting/ai-mvp-strategy', '/services/ai-solutions'],
  ['/consulting/enterprise-ai-search', '/services/ai-solutions'],
]) {
  const redirect = await fetch(base + path, { redirect: 'manual' });
  assert.equal(redirect.status, 308, path);
  assert.equal(new URL(redirect.headers.get('location'), base).pathname, destination);
}
const robots = await (await fetch(base + '/robots.txt')).text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`PASS ${urls.length} unique canonical sitemap pages, permanent legacy redirects, and robots sitemap declaration`);
