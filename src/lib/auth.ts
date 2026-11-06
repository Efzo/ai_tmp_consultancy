import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ADMIN_SESSION_MAX_AGE, adminIdleTimeoutMs, adminSessionExpired } from "@/lib/admin-session";
import { getAdminIdleTimeoutMinutes } from "@/lib/admin-session-settings";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getDemoPassword } from "@/lib/demo-password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.warn("[admin-auth] missing_credentials");
          return null;
        }
        const submittedEmail = credentials.email.trim().toLowerCase();
        // Environment credentials belong to demo/setup only. Production has one
        // source of truth: the user record and its stored bcrypt password.
        if (process.env.DEMO_MODE === "true") {
          const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          if (!email || submittedEmail !== email || credentials.password !== getDemoPassword()) return null;
          return { id: "owner", name: "Efosa Ojomo", email, role: "OWNER" };
        }
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl || databaseUrl.includes("demo_")) {
          console.error("[admin-auth] database_not_configured");
          return null;
        }
        try {
          const user = await prisma.user.findFirst({ where: { email: { equals: submittedEmail, mode: "insensitive" } } });
          if (!user?.password) {
            console.warn("[admin-auth] account_missing_or_password_not_set");
            return null;
          }
          if (!await bcrypt.compare(credentials.password, user.password)) {
            console.warn("[admin-auth] password_mismatch");
            return null;
          }
          return { id: user.id, name: user.name ?? "Administrator", email: user.email, role: user.role };
        } catch (error) {
          // Do not log credentials, connection strings or raw database errors.
          const failure = error as { code?: unknown; errorCode?: unknown; name?: unknown; message?: unknown } | null;
          const code = failure?.code ?? failure?.errorCode;
          const safeCode = typeof code === "string" && /^P\d{4}$/.test(code) ? code : "unknown";
          const safeName = typeof failure?.name === "string" && /^PrismaClient[A-Za-z]+Error$/.test(failure.name) ? failure.name : "unknown";
          const message = typeof failure?.message === "string" ? failure.message : "";
          const safeReason = /query engine|engine.*(?:not found|could not|unable)/i.test(message) ? "engine_unavailable" : /can't reach database|connection refused|timed out/i.test(message) ? "database_unreachable" : /authentication failed/i.test(message) ? "database_auth_failed" : /environment variable not found/i.test(message) ? "environment_missing" : /invalid.*(?:url|connection)|must start with.*postgres/i.test(message) ? "invalid_database_url" : "unclassified";
          const signals = ["engine", "binary", "openssl", "tls", "certificate", "ssl", "timeout", "connection", "authentication", "protocol", "url", "cache", "cached", "generation", "generated", "postinstall", "permission", "hostname", "refused", "closed", "datasource", "database", "schema", "server", "files"].filter((word) => new RegExp(`\\b${word}\\b`, "i").test(message));
          console.error("[admin-auth] database_or_password_verification_failed", safeCode, safeName, safeReason, signals.join(",") || "no_message_signals");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.idleTimeoutMinutes = await getAdminIdleTimeoutMinutes();
        token.role = (user as { role?: string }).role;
        token.lastActivityAt = Date.now();
        return token;
      }
      if (adminSessionExpired(token)) return {};
      // Ignore client-supplied timestamps; an update can only record server time.
      if (trigger === "update") token.lastActivityAt = Date.now();
      return token;
    },
    async session({ session, token }) {
      if (adminSessionExpired(token)) {
        delete session.user;
        session.expires = new Date(0).toISOString();
        return session;
      }
      if (session.user) {
        const user = session.user as { role?: string; id?: string };
        user.role = token.role as string | undefined;
        user.id = token.sub;
        if (process.env.DEMO_MODE !== "true") {
          const record = session.user.email ? await prisma.user.findUnique({ where: { email: session.user.email } }).catch(() => null) : null;
          user.role = record?.role;
          user.id = record?.id;
        }
      }
      return { ...session, idleTimeoutMinutes: adminIdleTimeoutMs(token.idleTimeoutMinutes) / 60_000, idleExpiresAt: (token.lastActivityAt as number) + adminIdleTimeoutMs(token.idleTimeoutMinutes) };
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: ADMIN_SESSION_MAX_AGE },
  jwt: { maxAge: ADMIN_SESSION_MAX_AGE },
};
