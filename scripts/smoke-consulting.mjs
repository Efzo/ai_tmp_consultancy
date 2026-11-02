import assert from 'node:assert/strict';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3100';
const routes = ['/', '/for-businesses', '/for-founders', '/services', '/services/customer-support-systems', '/services/software-engineering', '/services/technical-product-management', '/services/ai-solutions', '/services/software-architecture', '/engagements', '/case-studies', '/case-studies/clinchdesk', '/blog', '/contact', '/book', '/pricing', '/about', '/process', '/videos'];
for (const path of routes) {
  const response = await fetch(base + path);
  const html = await response.text();
  assert.equal(response.status, 200, path);
  if (path === '/pricing') assert.equal(new URL(response.url).pathname, '/engagements');
  assert.match(html, /<h1\b/, `${path}: semantic heading`);
  assert.match(html, /rel="canonical"/, `${path}: canonical`);
  if (path === '/') {
    assert.ok(html.includes('Busy running your business?'));
    assert.ok(html.includes('href="/for-businesses"'));
    assert.ok(html.includes('href="/for-founders"'));
  }
  if (path === '/engagements') {
    for (const name of ['Introductory Discovery Call', 'Business Website Build', 'Website Care &amp; Maintenance', 'Customer Support System Setup', 'Business Workflow Automation', 'Support &amp; Automation Management', 'Product Discovery Sprint', 'Custom Software Engineering', 'Fractional Technical Product Management']) assert.ok(html.includes(name));
    assert.ok(!html.includes('No engagement models published yet.'));
    assert.ok(html.includes('Free · 20–30 minutes'));
    assert.ok(!html.includes('Starting at $'));
    assert.ok(html.includes('Request a tailored quote'));
    assert.ok(html.includes('Maintenance does not include unlimited development'));
    const cards = [...html.matchAll(/<article\b[^>]*id="([^"]+)"[^>]*>(.*?)<\/article>/gs)];
    assert.equal(cards.length, 9);
    for (const [, id, card] of cards) {
      const href = card.match(/href="([^"]+)"/)[1].replaceAll('&amp;', '&');
      assert.equal(href, ['introductory-discovery-call', 'product-discovery-roadmap', 'fractional-tpm-monthly'].includes(id) ? '/book' : `/contact?offer=${id}`);
      assert.equal((await fetch(base + href)).status, 200);
    }
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
    assert.equal(JSON.parse(json).itemListElement.length, 9);
  }
  if (path === '/contact') {
    const dropdown = html.match(/<select[^>]*name="service"[^>]*>(.*?)<\/select>/s)[1];
    for (const id of ['introductory-discovery-call', 'business-website', 'website-care', 'support-systems-setup', 'business-automation', 'systems-management', 'product-discovery-roadmap', 'fractional-tpm-monthly', 'custom-software-engineering']) assert.ok(dropdown.includes(`value="${id}"`), id);
    for (const legacy of ['ai-strategy', 'fractional-tpm', 'solution-architecture', 'enterprise-search', 'ai-audit', 'product-management', 'product-delivery']) assert.ok(!dropdown.includes(`value="${legacy}"`), `legacy dropdown value: ${legacy}`);
  }
  if (path === '/case-studies/clinchdesk') {
    for (const section of ['Project Overview', 'Business Problem', 'Product Objectives', 'My Role and Responsibilities', 'Technical Architecture', 'Implementation Approach', 'Technical Trade-offs', 'Challenges and Solutions', 'Product Features', 'Outcomes and Lessons Learned']) assert.ok(html.includes(section), section);
    assert.ok(!html.includes('Project Mockup / Screenshot'));
  }
  console.log(`PASS ${path}`);
}
for (const path of ['/admin', '/admin/business-model', '/admin/pages/for-businesses', '/admin/pages/for-founders', '/admin/engagements', '/admin/page-builder', '/admin/packages', '/admin/case-studies']) {
  const response = await fetch(base + path, { redirect: 'manual' });
  assert.equal(response.status, 307);
  assert.ok(response.headers.get('location')?.includes('/admin/login'));
  console.log(`PASS protected ${path}`);
}
for (const method of ['POST', 'DELETE']) {
  assert.equal((await fetch(base + '/api/admin/media', { method })).status, 401);
}
assert.equal((await fetch(base + '/api/media/private')).status, 404);
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
assert.ok(sitemap.includes('/engagements'));
assert.ok(sitemap.includes('/for-businesses'));
assert.ok(sitemap.includes('/for-founders'));
assert.ok(sitemap.includes('/services/customer-support-systems'));
assert.ok(!sitemap.includes('<loc>https://ojomoefosa.com/pricing</loc>'));
assert.ok(sitemap.includes('/case-studies/clinchdesk'));
assert.ok((await (await fetch(base + '/robots.txt')).text()).includes('Disallow: /admin/'));
console.log('PASS media authorization, sitemap, and robots');
