import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
        } catch {
          // Do not log credentials, connection strings or raw database errors.
          console.error("[admin-auth] database_or_password_verification_failed");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
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
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
};
