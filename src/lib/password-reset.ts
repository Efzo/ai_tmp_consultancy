import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isApprovedAdminEmail } from "@/lib/admin-allowlist";

const acknowledgement = { success: true, message: "If that account exists, a reset email will be sent. Check your inbox and spam folder." };

export async function sendPasswordReset(email: string, setup = false) {
  email = email.trim().toLowerCase();
  const responseMessage = setup
    ? { success: true, message: "If this email is approved for admin access, an account setup link will be sent. Check your inbox and spam folder." }
    : acknowledgement;
  try {
    if (setup && !isApprovedAdminEmail(email)) return responseMessage;
    const { RESEND_API_KEY, RESEND_FROM_EMAIL, NEXTAUTH_URL } = process.env;
    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !NEXTAUTH_URL) {
      console.error("[password-reset] Email delivery configuration is incomplete.");
      return responseMessage;
    }
    const origin = new URL(NEXTAUTH_URL);
    if (!['http:', 'https:'].includes(origin.protocol) || (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:')) {
      console.error("[password-reset] Invalid application URL.");
      return responseMessage;
    }
    let user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
    if (!user && setup) {
      // No password means the pending account cannot sign in. Existing accounts
      // retain their roles; this request must never promote a viewer or editor.
      user = await prisma.user.upsert({ where: { email }, update: {}, create: { email, role: "OWNER" } });
    }
    if (!user) return responseMessage;
    // Persisted cooldown also applies across application instances.
    const recent = await prisma.passwordResetToken.findFirst({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } } });
    if (recent) return responseMessage;
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const record = await prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60_000) } });
    const resetUrl = new URL("/admin/reset-password", origin);
    resetUrl.searchParams.set("token", rawToken);
    if (setup) resetUrl.searchParams.set("setup", "1");
    let delivered = false;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [user.email], subject: setup ? "Set up your website admin account" : "Reset your website admin password", text: `${setup ? "A request was made to set up your approved website administrator account. Follow the link to verify your email and choose your password." : "A password reset was requested for your website administrator account."}\n\nOpen this link within 30 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.` }),
        signal: AbortSignal.timeout(10_000),
      });
      delivered = response.ok;
    } catch { /* Report only a safe event below. */ }
    if (!delivered) {
      await prisma.passwordResetToken.deleteMany({ where: { id: record.id } });
      console.error("[password-reset] Email provider did not accept the reset email.");
    }
  } catch {
    console.error("[password-reset] Request could not be completed.");
  }
  // Same response for missing accounts, delivery failures and success.
  return responseMessage;
}

export async function applyPasswordReset(token: string, password: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return { success: false, message: "This reset link is invalid or expired." };
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const hash = await bcrypt.hash(password, 12);
  try {
    const success = await prisma.$transaction(async (tx) => {
      const record = await tx.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: { select: { email: true, password: true } } } });
      if (!record || record.usedAt || record.expiresAt <= new Date()) return false;
      // Recheck pending invitations at activation in case the deployment's
      // approved email list changed after the setup link was issued.
      if (!record.user || (record.user.password === null && !isApprovedAdminEmail(record.user.email))) return false;
      // Claim the token conditionally so simultaneous submissions cannot reuse it.
      const claimed = await tx.passwordResetToken.updateMany({ where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } }, data: { usedAt: new Date() } });
      if (claimed.count !== 1) return false;
      await tx.user.update({ where: { id: record.userId }, data: { password: hash } });
      await tx.passwordResetToken.updateMany({ where: { userId: record.userId, usedAt: null }, data: { usedAt: new Date() } });
      return true;
    });
    return success ? { success: true, message: "Password updated. You can now sign in." } : { success: false, message: "This reset link is invalid or expired." };
  } catch {
    console.error("[password-reset] Password update could not be completed.");
    return { success: false, message: "Unable to update your password. Please try again or request a new link." };
  }
}
