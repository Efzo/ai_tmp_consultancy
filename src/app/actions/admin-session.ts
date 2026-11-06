"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminIdleSettingKey } from "@/lib/admin-session-settings";
import { formatAdminIdleMinutes, validAdminIdleMinutes } from "@/lib/admin-session";

export async function updateAdminIdleTimeoutMinutes(input: unknown) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "OWNER") throw new Error("Only the owner can change the admin inactivity timeout.");
  if (!validAdminIdleMinutes(input)) return { success: false, message: "Choose a whole number of minutes between 5 and 1,440 (24 hours)." };
  if (process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) return { success: false, message: "Connect PostgreSQL and disable demo mode to save security settings." };
  try {
    await prisma.$transaction(async (tx) => {
      await tx.siteSetting.upsert({ where: { key: adminIdleSettingKey }, create: { key: adminIdleSettingKey, value: input }, update: { value: input } });
      await tx.auditEvent.create({ data: { action: "security.idle_timeout.updated", target: adminIdleSettingKey, actorId: user.id, metadata: { minutes: input } } });
    });
    revalidatePath("/admin/security");
    return { success: true, minutes: input, message: `Saved. New sign-ins will use ${formatAdminIdleMinutes(input)} of inactivity. Existing sessions keep their current duration.` };
  } catch {
    return { success: false, message: "The timeout could not be saved. Please try again." };
  }
}
