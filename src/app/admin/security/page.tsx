import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminIdleTimeoutMinutes } from "@/lib/admin-session-settings";
import AdminIdleTimeoutEditor from "@/components/admin/AdminIdleTimeoutEditor";
import Link from "next/link";
import { AdminModule } from "@/components/admin/AdminModule";

export default async function SecurityAdminPage() {
  const [session, minutes] = await Promise.all([getServerSession(authOptions), getAdminIdleTimeoutMinutes()]);
  const canEdit = (session?.user as { role?: string } | undefined)?.role === "OWNER";
  const checks = [{ name: "Admin route protection", state: "Enabled" }, { name: "Database accounts and hashed passwords", state: "Enabled" }, { name: "Email verified account setup", state: process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.NEXTAUTH_URL ? "Enabled for approved emails" : "Email configuration required" }, { name: "Demo mode", state: process.env.DEMO_MODE === "true" ? "Enabled locally" : "Disabled" }, { name: "Database connection", state: !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_") ? "Not configured" : "Configured" }, { name: "MFA", state: "Not configured" }]; return <AdminModule title="Security Settings" description="Manage automatic logout and review authentication controls." status="Review before launch"><div className="space-y-6"><AdminIdleTimeoutEditor minutes={minutes} canEdit={canEdit} /><p className="text-sm leading-relaxed text-slate-muted">To change your password, request a secure email link. Your password is stored as a hash in the database.</p><Link href="/admin/forgot-password" className="btn-primary inline-flex">Change or reset my password</Link><div className="glass-panel overflow-hidden"><div className="divide-y divide-glass">{checks.map((check) => <div key={check.name} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5"><span>{check.name}</span><span className={check.state.includes("Enabled") || check.state === "Configured" ? "text-green-300" : "text-amber-300"}>{check.state}</span></div>)}</div></div></div></AdminModule>; }
