import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const acknowledgement = { success: true, message: "If that account exists, a reset email will be sent. Check your inbox and spam folder." };

export async function sendPasswordReset(email: string) {
  try {
    const { RESEND_API_KEY, RESEND_FROM_EMAIL, NEXTAUTH_URL } = process.env;
    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !NEXTAUTH_URL) {
      console.error("[password-reset] Email delivery configuration is incomplete.");
      return acknowledgement;
    }
    const origin = new URL(NEXTAUTH_URL);
    if (!['http:', 'https:'].includes(origin.protocol) || (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:')) {
      console.error("[password-reset] Invalid application URL.");
      return acknowledgement;
    }
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
    if (!user) return acknowledgement;
    // Persisted cooldown also applies across application instances.
    const recent = await prisma.passwordResetToken.findFirst({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } } });
    if (recent) return acknowledgement;
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const record = await prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60_000) } });
    const resetUrl = new URL("/admin/reset-password", origin);
    resetUrl.searchParams.set("token", rawToken);
    let delivered = false;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [user.email], subject: "Reset your website admin password", text: `A password reset was requested for your website administrator account.\n\nOpen this link within 30 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.` }),
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
  return acknowledgement;
}

export async function applyPasswordReset(token: string, password: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return { success: false, message: "This reset link is invalid or expired." };
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const hash = await bcrypt.hash(password, 12);
  try {
    const success = await prisma.$transaction(async (tx) => {
      const record = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
      if (!record || record.usedAt || record.expiresAt <= new Date()) return false;
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
