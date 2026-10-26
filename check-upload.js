const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const latest = await prisma.mediaAsset.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    console.log("Latest Media Asset:", latest);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
check();
