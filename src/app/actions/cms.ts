"use server";

import { getServerSession } from "next-auth";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeDemoResetToken, createDemoResetToken, setDemoPassword } from "@/lib/demo-password";
import { footerSettingDefaults, setDemoSiteSetting } from "@/lib/site-settings";
import { revalidatePath } from "next/cache";

const pageSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(160),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
  content: z.array(z.object({ id: z.string(), type: z.enum(["hero", "rich-text", "services", "cta"]), title: z.string(), visible: z.boolean() })),
});
const blogSchema = z.object({ id: z.string().optional(), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().trim().min(2).max(180), excerpt: z.string().trim().min(10).max(500), content: z.string().trim().min(20).max(50000), category: z.string().trim().min(2).max(80) });

async function requireRole(roles: Array<"OWNER" | "EDITOR" | "VIEWER"> = ["OWNER", "EDITOR"]) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: "OWNER" | "EDITOR" | "VIEWER" } | undefined)?.role;
  if (!role || !roles.includes(role)) throw new Error("Unauthorized");
  return { session, role };
}

function dbReady() {
  return process.env.DEMO_MODE !== "true" && Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("demo_");
}

async function audit(action: string, target: string, metadata?: Prisma.InputJsonValue) {
  if (!dbReady()) return;
  await prisma.auditEvent.create({ data: { action, target, metadata } });
}

export async function savePageDraft(input: unknown) {
  await requireRole();
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL and disable demo mode before saving CMS content." };
  const parsed = pageSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "The page content is invalid." };
  const data = parsed.data;
  const content = data.content as Prisma.InputJsonValue;
  try {
    if (!data.id) {
      const page = await prisma.page.create({ data: { slug: data.slug, title: data.title, content, metaTitle: data.metaTitle || null, metaDescription: data.metaDescription || null, status: "DRAFT", isPublished: false, versions: { create: { version: 1, title: data.title, content, metaTitle: data.metaTitle || null, metaDescription: data.metaDescription || null } } } });
      await audit("page.created", page.id);
      return { success: true, id: page.id, message: "Draft created." };
    }
    const page = await prisma.page.findUnique({ where: { id: data.id }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } });
    if (!page) return { success: false, message: "Page not found." };
    const version = (page.versions[0]?.version ?? 0) + 1;
    await prisma.$transaction([
      prisma.page.update({ where: { id: data.id }, data: { slug: data.slug, title: data.title, content, metaTitle: data.metaTitle || null, metaDescription: data.metaDescription || null, status: "DRAFT", isPublished: false } }),
      prisma.pageVersion.create({ data: { pageId: data.id, version, title: data.title, content, metaTitle: data.metaTitle || null, metaDescription: data.metaDescription || null } }),
    ]);
    await audit("page.draft_saved", data.id, { version });
    return { success: true, id: data.id, message: "Draft saved." };
  } catch {
    return { success: false, message: "The draft could not be saved." };
  }
}

export async function publishPage(pageId: string) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before publishing." };
  await prisma.page.update({ where: { id: pageId }, data: { status: "PUBLISHED", isPublished: true, publishedAt: new Date() } });
  await audit("page.published", pageId);
  return { success: true, message: "Page published." };
}

export async function restorePageVersion(pageId: string, versionId: string) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before restoring a version." };
  const [page, version] = await Promise.all([prisma.page.findUnique({ where: { id: pageId }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } }), prisma.pageVersion.findUnique({ where: { id: versionId } })]);
  if (!page || !version || version.pageId !== pageId) return { success: false, message: "Version not found." };
  const nextVersion = (page.versions[0]?.version ?? 0) + 1;
  const restoredContent = version.content as Prisma.InputJsonValue;
  await prisma.$transaction([prisma.page.update({ where: { id: pageId }, data: { title: version.title, content: restoredContent, metaTitle: version.metaTitle, metaDescription: version.metaDescription, status: "DRAFT", isPublished: false } }), prisma.pageVersion.create({ data: { pageId, version: nextVersion, title: version.title, content: restoredContent, metaTitle: version.metaTitle, metaDescription: version.metaDescription } })]);
  await audit("page.version_restored", pageId, { versionId });
  return { success: true, message: "Version restored as a new draft." };
}

export async function updateService(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before editing services." };
  const parsed = z.object({ id: z.string(), title: z.string().min(2).max(160), shortDescription: z.string().min(10).max(500), fullDescription: z.string().min(10).max(4000), targetAudience: z.string().min(2).max(500), ctaText: z.string().min(2).max(80), price: z.string().max(80).nullable().optional(), isPublished: z.boolean() }).safeParse(input);
  if (!parsed.success) return { success: false, message: "Service data is invalid." };
  const { id, ...serviceData } = parsed.data;
  await prisma.service.update({ where: { id }, data: serviceData });
  await audit("service.updated", id);
  return { success: true, message: "Service updated." };
}

export async function saveBlogPostDraft(input: unknown) {
  await requireRole();
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before saving articles." };
  const parsed = blogSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Article data is invalid." };
  const data = parsed.data;
  try {
    if (!data.id) {
      const post = await prisma.blogPost.create({ data: { slug: data.slug, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category, status: "DRAFT", versions: { create: { version: 1, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category } } } });
      await audit("blog.created", post.id);
      return { success: true, id: post.id, message: "Article draft created." };
    }
    const post = await prisma.blogPost.findUnique({ where: { id: data.id }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } });
    if (!post) return { success: false, message: "Article not found." };
    const version = (post.versions[0]?.version ?? 0) + 1;
    await prisma.$transaction([prisma.blogPost.update({ where: { id: data.id }, data: { slug: data.slug, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category, status: "DRAFT" } }), prisma.blogPostVersion.create({ data: { blogPostId: data.id, version, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category } })]);
    await audit("blog.draft_saved", data.id, { version });
    return { success: true, id: data.id, message: "Article draft saved." };
  } catch { return { success: false, message: "The article draft could not be saved." }; }
}

export async function publishBlogPost(postId: string) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before publishing articles." };
  await prisma.blogPost.update({ where: { id: postId }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  await audit("blog.published", postId);
  return { success: true, message: "Article published." };
}

export async function updateSiteSetting(key: string, value: unknown) {
  await requireRole(["OWNER"]);
  const parsedValue = z.string().trim().max(2000).safeParse(value);
  if (!parsedValue.success) return { success: false, message: "Setting value is invalid." };
  const footerKey = key.startsWith("footer.") ? key.slice("footer.".length) : "";
  if (footerKey && !(footerKey in footerSettingDefaults)) return { success: false, message: "Footer setting is not supported." };
  if (footerKey) {
    const url = parsedValue.data;
    const isRelativePath = url.startsWith("/") && !url.startsWith("//");
    const isWebUrl = /^https?:\/\//i.test(url);
    const isContactUrl = /^(mailto:|tel:)/i.test(url);
    if (!isRelativePath && !isWebUrl && !isContactUrl) return { success: false, message: "Use an internal path or a valid web URL." };
  }
  if (!dbReady()) {
    setDemoSiteSetting(key, parsedValue.data);
    revalidatePath("/", "layout");
    return { success: true, message: "Setting updated for this running server." };
  }
  await prisma.siteSetting.upsert({ where: { key }, update: { value: parsedValue.data as Prisma.InputJsonValue }, create: { key, value: parsedValue.data as Prisma.InputJsonValue } });
  await audit("setting.updated", key);
  revalidatePath("/", "layout");
  return { success: true, message: "Setting updated." };
}

export async function updateUserRole(userId: string, role: "OWNER" | "EDITOR" | "VIEWER") {
  await requireRole(["OWNER"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before managing users." };
  await prisma.user.update({ where: { id: userId }, data: { role } });
  await audit("user.role_updated", userId, { role });
  return { success: true, message: "Role updated." };
}

export async function requestPasswordReset(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  if (!z.string().email().safeParse(email).success) return { success: false, message: "Enter a valid email address." };
  const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const isConfiguredAccount = email === configuredEmail;
  if (process.env.DEMO_MODE === "true") {
    if (!isConfiguredAccount) return { success: true, message: "If that account exists, a reset link has been prepared." };
    const token = createDemoResetToken();
    return { success: true, message: "Demo reset link created.", resetUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${token}` };
  }
  if (!dbReady()) return { success: true, message: "If that account exists, a reset email will be sent." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: true, message: "If that account exists, a reset email will be sent." };
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60 * 1000) } });
  const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${rawToken}`;
  if (process.env.RESEND_API_KEY && process.env.BUSINESS_EMAIL && process.env.RESEND_FROM_EMAIL) {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [email], subject: "Reset your admin portal password", html: `<p>Reset your password within 30 minutes:</p><p><a href="${resetUrl}">${resetUrl}</a></p>` }) }).catch(() => undefined);
  }
  return { success: true, message: "If that account exists, a reset email will be sent." };
}

export async function resetPassword(tokenInput: string, passwordInput: string) {
  const token = tokenInput.trim();
  const password = passwordInput.trim();
  if (password.length < 8) return { success: false, message: "Password must be at least 8 characters." };
  if (process.env.DEMO_MODE === "true") {
    if (!consumeDemoResetToken(token)) return { success: false, message: "This reset link is invalid or has already been used." };
    setDemoPassword(password);
    return { success: true, message: "Demo password updated for this running server." };
  }
  if (!dbReady()) return { success: false, message: "Password reset is not configured." };
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) return { success: false, message: "This reset link is invalid or expired." };
  await prisma.$transaction([prisma.user.update({ where: { id: resetToken.userId }, data: { password: await bcrypt.hash(password, 12) } }), prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } })]);
  return { success: true, message: "Password updated. You can now sign in." };
}
