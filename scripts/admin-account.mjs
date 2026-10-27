import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { pathToFileURL } from 'node:url';

class AdminSetupError extends Error {}

export function adminSetupErrorMessage(error) {
  if (error instanceof AdminSetupError) return error.message;
  // Use allowlisted error codes only. Raw errors can contain credentials or URLs.
  switch (error?.code ?? error?.errorCode) {
    case 'P1000': return 'Database authentication failed. Check the database credentials in DATABASE_URL.';
    case 'P1001': return 'Cannot reach the database. Check the host, network access and DATABASE_URL.';
    case 'P1002': case 'P2024': return 'The database connection timed out. Check database availability and retry.';
    case 'P1010': return 'The database user does not have access to this database.';
    case 'P2021': case 'P2022': return 'The database schema is missing a required table or column. Review the existing migrations against the intended database. A password reset transaction was rolled back.';
    case 'P2002': return 'An account with this email already exists. Run --check before retrying.';
    case 'P2028': return 'The database transaction failed or expired. Check database availability and retry.';
    default: return 'Unexpected database or setup error. Check database availability and schema. No raw error details are printed because they may contain secrets.';
  }
}

export async function provisionAdmin(prisma, env, { resetPassword = false, check = false } = {}) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminSetupError('Set ADMIN_EMAIL to a valid email address.');
  if (!env.DATABASE_URL?.trim()) throw new AdminSetupError('DATABASE_URL is missing. Load the intended database connection string in this terminal or its environment file.');
  if (env.DATABASE_URL.includes('demo_') || env.DEMO_MODE === 'true') throw new AdminSetupError('Connect the intended PostgreSQL database and set DEMO_MODE=false.');
  const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  if (check) {
    if (!existing) return 'No account exists for ADMIN_EMAIL.';
    const matches = env.ADMIN_PASSWORD && existing.password ? await bcrypt.compare(env.ADMIN_PASSWORD, existing.password) : undefined;
    return `Account exists. Role: ${existing.role}. Password set: ${Boolean(existing.password)}. Configured ADMIN_PASSWORD matches database: ${matches === undefined ? 'not checked (password missing)' : matches ? 'yes' : 'NO - changing .env does not reset the saved password'}.`;
  }
  if (existing && !resetPassword) return 'Account already exists; nothing changed. Use --reset-password only to replace its password and set its role to OWNER.';
  const password = env.ADMIN_PASSWORD;
  if (!password || password.trim().length < 8 || Buffer.byteLength(password, 'utf8') > 72) throw new AdminSetupError('Set ADMIN_PASSWORD to at least 8 non-padding characters and at most 72 UTF-8 bytes.');
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
  if (args.some((arg) => !['--check', '--reset-password'].includes(arg)) || args.length > 1) throw new AdminSetupError('Usage: npm run admin:create -- [--check | --reset-password]');
  // Match Next.js env loading; exported deployment variables take precedence.
  nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
  const prisma = new PrismaClient();
  try { console.log(await provisionAdmin(prisma, process.env, { check: args.includes('--check'), resetPassword: args.includes('--reset-password') })); }
  finally { await prisma.$disconnect(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    // Never print a database URL, password, or raw Prisma error.
    console.error(`Admin setup failed. ${adminSetupErrorMessage(error)}`);
    process.exitCode = 1;
  });
}
