import assert from 'node:assert/strict';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3100';
for (const path of ['/admin', '/admin/leads', '/admin/login', '/admin/setup', '/admin/forgot-password', '/admin/reset-password', '/api/admin/preview', '/api/auth/session']) {
  const response = await fetch(base + path, { redirect: 'manual' });
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/, `${path}: excluded from search`);
  assert.match(response.headers.get('cache-control') || '', /no-store/, `${path}: private response not cached`);
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer', `${path}: no referrer leakage`);
  if (['/admin', '/admin/leads'].includes(path)) assert.equal(response.status, 307, `${path}: requires login`);
  if (path === '/api/admin/preview') assert.equal(response.status, 401);
  if (path === '/admin/login') assert.match(await response.text(), /<meta name="robots" content="[^"]*noindex/);
  console.log(`PASS private indexing/cache rules ${path}`);
}
for (const path of ['/cv', '/cv/Efosa_Ezekiel_Ojomo_CV_SA.pdf', '/cv/Efosa_Ojomo_AI_Product_Owner.pdf']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 410, `${path}: legacy CV retired`);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  assert.equal(await response.text(), 'This document is no longer publicly available.');
  console.log(`PASS retired document ${path}`);
}
for (const path of ['/.env', '/.git/config', '/package.json', '/docs/Efosa_business_model.pdf']) {
  assert.equal((await fetch(base + path)).status, 404, `${path}: not publicly served`);
}
const publicPage = await fetch(base + '/');
assert.equal(publicPage.status, 200);
assert.ok(!/noindex/.test(publicPage.headers.get('x-robots-tag') || ''));
assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(await publicPage.text()));
const preview = await fetch(base + '/', { headers: { Cookie: '__prerender_bypass=privacy-test' } });
assert.match(preview.headers.get('x-robots-tag') || '', /noindex/);
assert.match(preview.headers.get('cache-control') || '', /no-store/);
const robots = await (await fetch(base + '/robots.txt')).text();
assert.ok(!/Disallow:\s*\/(?:admin|cv)/.test(robots), 'Crawlers must see noindex/410 responses');
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
assert.ok(!/<loc>[^<]*\/(?:admin|api|cv|docs)(?:\/|<)/.test(sitemap));
console.log('PASS public SEO, preview exclusion, private-file access, robots and sitemap');
