import { AdminModule, SetupCard } from "@/components/admin/AdminModule";
import RoleManager from "@/components/admin/RoleManager";
import { prisma } from "@/lib/prisma";

async function getUsers() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return [];
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, password: true }, orderBy: { createdAt: "asc" } });
    // Only send a status flag to the client, never a password hash.
    return users.map(({ password, ...user }) => ({ ...user, hasPassword: Boolean(password) }));
  } catch { return []; }
}

export default async function UsersAdminPage() {
  const users = await getUsers();
  return <AdminModule title="Admin Users & Roles" description="Manage owner, editor, and viewer permissions." status={users.length ? "Database connected" : "Needs database seed"}>{users.length ? <RoleManager users={users} /> : <div className="grid gap-4 md:grid-cols-3"><SetupCard title="Owner" body="Full access to content, leads, settings, users, and audit records." action="Database role required" /><SetupCard title="Editor" body="Manage and publish approved content without changing security settings." action="Database role required" /><SetupCard title="Viewer" body="Read-only access to operational data." action="Database role required" /></div>}</AdminModule>;
}
