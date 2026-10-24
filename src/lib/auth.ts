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
        const configuredEmail = process.env.ADMIN_EMAIL;
        if (!configuredEmail || !credentials?.email || !credentials.password) return null;
        const databaseUrl = process.env.DATABASE_URL;
        const databaseReady = process.env.DEMO_MODE !== "true" && Boolean(databaseUrl) && !databaseUrl?.includes("demo_");
        const databaseUser = databaseReady ? await prisma.user.findUnique({ where: { email: credentials.email } }).catch(() => null) : null;
        const email = databaseUser?.email ?? configuredEmail;
        const passwordHash = databaseUser?.password;
        const passwordMatches = passwordHash ? await bcrypt.compare(credentials.password, passwordHash) : credentials.password === getDemoPassword();
        if (credentials.email !== email || !passwordMatches) return null;
        return { id: databaseUser?.id ?? "owner", name: databaseUser?.name ?? "Efosa Ojomo", email, role: databaseUser?.role ?? "OWNER" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string | undefined;
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
};
