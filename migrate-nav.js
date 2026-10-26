const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'navigation.items' } });
    if (!setting) {
      console.log("No navigation settings found in DB. Using defaults.");
      return;
    }

    const items = JSON.parse(setting.value);
    if (!items.some(item => item.href === '/videos')) {
      items.push({ label: 'Videos', href: '/videos' });
      await prisma.siteSetting.update({
        where: { key: 'navigation.items' },
        data: { value: items }
      });
      console.log("Successfully added 'Videos' to navigation items in DB.");
    } else {
      console.log("'Videos' already exists in navigation.");
    }
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
