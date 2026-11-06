import { prisma } from "@/lib/prisma";
import { DEFAULT_ADMIN_IDLE_MINUTES, validAdminIdleMinutes } from "@/lib/admin-session";

export const adminIdleSettingKey = "security.adminIdleTimeoutMinutes";
export async function getAdminIdleTimeoutMinutes() {
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return DEFAULT_ADMIN_IDLE_MINUTES;
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: adminIdleSettingKey }, select: { value: true } });
    return validAdminIdleMinutes(setting?.value) ? setting.value : DEFAULT_ADMIN_IDLE_MINUTES;
  } catch {
    // Fail sign-in closed if the configured policy cannot be read. Never log a
    // connection string or silently lengthen a saved short timeout on outage.
    throw new Error("Admin session settings could not be loaded. Please try again shortly.");
  }
}
