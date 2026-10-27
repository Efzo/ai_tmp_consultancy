import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { pathToFileURL } from 'node:url';

export async function provisionAdmin(prisma, env, { resetPassword = false, check = false } = {}) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Set ADMIN_EMAIL to a valid email address.');
  if (!env.DATABASE_URL || env.DATABASE_URL.includes('demo_') || env.DEMO_MODE === 'true') throw new Error('Connect the intended PostgreSQL database and set DEMO_MODE=false.');
  const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  if (check) return existing ? `Account exists. Role: ${existing.role}. Password set: ${Boolean(existing.password)}.` : 'No account exists for ADMIN_EMAIL.';
  if (existing && !resetPassword) return 'Account already exists; nothing changed. Use --reset-password only to replace its password and set its role to OWNER.';
  const password = env.ADMIN_PASSWORD;
  if (!password || password.trim().length < 8 || Buffer.byteLength(password, 'utf8') > 72) throw new Error('Set ADMIN_PASSWORD to at least 8 non-padding characters and at most 72 UTF-8 bytes.');
  const hash = await bcrypt.hash(password, 12);
  if (existing) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: existing.id }, data: { password: hash, role: 'OWNER' } });
      await tx.passwordResetToken.deleteMany({ where: { userId: existing.id } });
    });
    return 'Admin password replaced and role set to OWNER. Outstanding password reset links revoked.';
  }
  await prisma.user.create({ data: { email, name: 'Efosa Ojomo', role: 'OWNER', password: hash } });
  return 'Admin account created with role OWNER. You can now sign in.';
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !['--check', '--reset-password'].includes(arg)) || args.length > 1) throw new Error('Usage: npm run admin:create -- [--check | --reset-password]');
  // Match Next.js env loading; exported deployment variables take precedence.
  nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
  const prisma = new PrismaClient();
  try { console.log(await provisionAdmin(prisma, process.env, { check: args.includes('--check'), resetPassword: args.includes('--reset-password') })); }
  finally { await prisma.$disconnect(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    // Never print a database URL, password, or raw Prisma error.
    console.error('Admin setup failed. Check the environment, password requirements (8 characters, maximum 72 UTF-8 bytes), database connection and migrations. Use only --check or --reset-password as optional flags.');
    process.exitCode = 1;
  });
}
