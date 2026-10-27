import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
const offers = JSON.parse(readFileSync(new URL('../src/data/offers.json', import.meta.url)));
const defaults = JSON.parse(readFileSync(new URL('../src/data/page-defaults.json', import.meta.url)));
const pricing = load('src/data/pricing.ts', { './offers.json': offers });

test('six default offers validate with requested fees and conversion workflows', () => {
  assert.equal(pricing.pricingPlansSchema.safeParse(offers).success, true);
  assert.deepEqual(offers.map((p) => p.price), ['Free · 20–30 minutes', 'Starting at $2,500 per engagement', 'Starting at $3,500 per engagement', 'Starting at $2,500 per engagement', 'Starting at $3,000 per month', 'Custom proposal']);
  for (const plan of offers) {
    assert.ok(plan.audience && plan.problem && plan.engagementModel && plan.features.length);
    assert.equal(pricing.pricingCtaHref(plan), plan.id === 'custom-software-engineering' ? '/contact?offer=custom-software-engineering' : '/book');
  }
});

test('pricing validation rejects duplicate anchors, unsafe IDs, missing visible prices, and external destinations', () => {
  for (const input of [[offers[0], offers[0]], [{ ...offers[0], id: '../unsafe' }], [{ ...offers[0], price: '' }], [{ ...offers[0], ctaDestination: 'https://example.com' }]]) {
    assert.equal(pricing.pricingPlansSchema.safeParse(input).success, false);
  }
  const legacy = { ...offers[1] };
  for (const key of ["audience", "problem", "engagementModel", "ctaDestination"]) delete legacy[key];
  const parsed = pricing.pricingPlansSchema.parse([legacy]);
  assert.equal(parsed[0].ctaDestination, 'contact');
  assert.equal(parsed[0].audience, '');
});

test('public cards and structured data respect publication and price visibility', async () => {
  const visible = { ...offers[1], showPrice: false, name: 'Public </script><script> marker' };
  const page = load('src/app/engagements/page.tsx', {
    'next/link': ({ href, children, ...props }) => createElement('a', { ...props, href }, children),
    '@/components/ManagedPageCTA': () => null,
    '@/components/admin/PagePreviewBanner': () => null,
    '@/lib/managed-pages': { getManagedPageContent: async () => defaults.engagements },
    '@/lib/site-settings': { getPricingPlans: async () => [visible, { ...offers[2], isPublished: false }] },
    '@/data/pricing': pricing,
  });
  const html = renderToStaticMarkup(await page.default());
  assert.ok(!html.includes('$2,500'));
  assert.ok(!html.includes('AI Readiness Assessment'));
  assert.ok(html.includes('href="/book"'));
  assert.ok(html.includes('Statement of Work'));
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
  assert.ok(!json.includes('</script>'));
  const data = JSON.parse(json);
  assert.equal(data.itemListElement.length, 1);
  assert.equal(data.itemListElement[0].item.name, visible.name);
  assert.equal(data.itemListElement[0].item.offers, undefined);
});

test('CMS changes persist all fields, refresh public consumers, and enforce roles', async () => {
  const original = { ...process.env };
  Object.assign(process.env, { DEMO_MODE: 'true', DATABASE_URL: '' });
  let role = 'OWNER'; const revalidated = []; let stored; let databaseValue;
  const prisma = {
    user: { findUnique: async () => ({ role }) },
    siteSetting: { upsert: async ({ update }) => { databaseValue = update.value; } },
    auditEvent: { create: async () => ({}) },
  };
  const cms = load('src/app/actions/cms.ts', {
    'next-auth': { getServerSession: async () => ({ user: { role, email: 'owner@example.com' } }) },
    '@/lib/password-reset': {}, '@/lib/auth': {}, '@/lib/prisma': { prisma }, '@/lib/demo-password': {},
    '@/lib/site-settings': { setDemoSiteSetting: (key, value) => { stored = { key, value: JSON.parse(value) }; } },
    '@/lib/rich-text': {}, 'next/cache': { revalidatePath: (path) => revalidated.push(path) },
    '@/lib/home-content': { homeSchema: require('zod').z.object({}) }, '@/lib/case-details': {},
    '@/lib/page-content-schema': {}, '@/data/consulting.json': {}, '@/data/pricing': pricing,
  });
  try {
    assert.equal((await cms.updatePricingPlans(offers)).success, true);
    assert.equal(stored.key, pricing.pricingCatalogKey);
    assert.deepEqual(stored.value, pricing.pricingPlansSchema.parse(offers));
    for (const path of ['/engagements', '/', '/contact']) assert.ok(revalidated.includes(path));
    const before = stored;
    assert.equal((await cms.updatePricingPlans([offers[0], offers[0]])).success, false);
    assert.equal(stored, before);
    Object.assign(process.env, { DEMO_MODE: 'false', DATABASE_URL: 'postgresql://test' });
    assert.equal((await cms.updatePricingPlans(offers)).success, true);
    assert.deepEqual(databaseValue, pricing.pricingPlansSchema.parse(offers));
    role = 'VIEWER';
    await assert.rejects(cms.updatePricingPlans(offers), /Unauthorized/);
  } finally { process.env = original; }
});

test('saved CMS offers and navigation are read without replacing custom content', async () => {
  const original = { ...process.env };
  Object.assign(process.env, { DEMO_MODE: 'true', DATABASE_URL: '' });
  try {
    const settings = load('src/lib/site-settings.ts', { '@/lib/prisma': { prisma: {} }, '@/data/pricing': pricing });
    const custom = [{ ...offers[2], price: 'Starting at $4,000 per engagement', showPrice: false, isPublished: false }];
    settings.setDemoSiteSetting(pricing.pricingCatalogKey, JSON.stringify(custom));
    assert.deepEqual(await settings.getPricingPlans(), pricing.pricingPlansSchema.parse(custom));
    settings.setDemoSiteSetting('navigation.items', JSON.stringify([{ label: 'My custom page', href: '/about' }, { label: 'Old pricing', href: '/pricing' }, { label: 'Engagements', href: '/engagements' }]));
    assert.deepEqual(await settings.getNavigationItems(), [{ label: 'My custom page', href: '/about' }, { label: 'Engagements & Pricing', href: '/engagements' }]);
  } finally { process.env = original; }
});

test('legacy saved pricing cannot hide the six new defaults', async () => {
  const original = { ...process.env };
  Object.assign(process.env, { DEMO_MODE: 'true', DATABASE_URL: '' });
  try {
    const settings = load('src/lib/site-settings.ts', { '@/lib/prisma': { prisma: {} }, '@/data/pricing': pricing });
    settings.setDemoSiteSetting('pricing.plans', JSON.stringify([{ ...offers[1], name: 'Old assessment', price: '', showPrice: false }]));
    const current = await settings.getPricingPlans();
    assert.deepEqual(current.map((offer) => offer.name), offers.map((offer) => offer.name));
    assert.ok(current.every((offer) => offer.showPrice && offer.price));
    settings.setDemoSiteSetting(pricing.pricingCatalogKey, JSON.stringify([{ ...offers[1], name: 'My edited sprint', price: 'Starting at $4,000', isPublished: false }]));
    assert.equal((await settings.getPricingPlans())[0].name, 'My edited sprint');
    assert.equal((await settings.getPricingPlans())[0].isPublished, false);
  } finally { process.env = original; }
});

const consulting = JSON.parse(readFileSync(new URL('../src/data/consulting.json', import.meta.url)));
const serviceData = load('src/data/services.ts', { './consulting.json': consulting });
test('legacy services are omitted from listings, while legacy links resolve to published current capabilities', async () => {
  const original = { ...process.env };
  Object.assign(process.env, { DEMO_MODE: 'false', DATABASE_URL: 'postgresql://test' });
  const rows = [
    ...serviceData.services.map((service) => ({ ...service, isPublished: true })),
    ...Object.keys(serviceData.serviceAliases).map((slug) => ({ slug, title: 'Legacy duplicate', isPublished: true })),
  ];
  const services = load('src/lib/services.ts', { '@/data/services': serviceData, '@/lib/prisma': { prisma: { service: { findMany: async () => rows } } } });
  try {
    assert.equal((await services.getManagedServices()).length, 4);
    for (const [legacy, current] of Object.entries(serviceData.serviceAliases)) assert.equal((await services.getManagedService(legacy)).slug, current);
    rows.find((row) => row.slug === 'technical-product-management').isPublished = false;
    assert.equal(await services.getManagedService('fractional-tpm'), undefined);
    assert.equal((await services.getManagedServices()).length, 3);
  } finally { process.env = original; }
});

test('contact choices match published pricing offers, preselect requested offers, and support legacy service links', async () => {
  let props; let current = offers;
  const contact = load('src/app/contact/page.tsx', {
    '@/lib/managed-pages': { getManagedPageContent: async () => defaults.contact },
    '@/components/admin/PagePreviewBanner': () => null,
    '@/components/ContactForm': (value) => { props = value; return null; },
    '@/data/services': serviceData,
    '@/lib/site-settings': { getContactDetails: async () => ({}), getContactBudgetOptions: async () => [], getPricingPlans: async () => current },
  });
  renderToStaticMarkup(await contact.default({ searchParams: Promise.resolve({ offer: 'custom-software-engineering' }) }));
  assert.deepEqual(props.services, offers.map(({ id, name }) => ({ slug: id, title: name })));
  assert.equal(props.initialService, 'custom-software-engineering');
  assert.equal(props.offer, 'Custom Software Engineering');
  renderToStaticMarkup(await contact.default({ searchParams: Promise.resolve({ service: 'ai-strategy' }) }));
  assert.equal(props.initialService, 'ai-readiness-assessment');
  current = offers.map((offer) => ({ ...offer, isPublished: false }));
  renderToStaticMarkup(await contact.default({ searchParams: Promise.resolve({ offer: 'custom-software-engineering' }) }));
  assert.equal(props.initialService, undefined);
  assert.deepEqual(props.services, [{ slug: 'general-inquiry', title: 'General inquiry' }]);
});
