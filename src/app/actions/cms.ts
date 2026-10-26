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
import { sanitizeRichText } from "@/lib/rich-text";
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
  const session = await getServerSession(authOptions);
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  await prisma.auditEvent.create({ data: { action, target, metadata, actorId: actorId || null } });
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
  if (!page || !version || version.pageId !== page.id) return { success: false, message: "Version not found." };
  const nextVersion = (page.versions[0]?.version ?? 0) + 1;
  const restoredContent = version.content as Prisma.InputJsonValue;
  await prisma.$transaction([prisma.page.update({ where: { id: pageId }, data: { title: version.title, content: restoredContent, metaTitle: version.metaTitle, metaDescription: version.metaDescription } }), prisma.pageVersion.create({ data: { pageId, version: nextVersion, title: version.title, content: restoredContent, metaTitle: version.metaTitle, metaDescription: version.metaDescription } })]);
  await audit("page.version_restored", pageId, { versionId });
  return { success: true, message: "Version restored as a new draft." };
}

export async function updateService(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before editing services." };
  const parsed = z.object({ id: z.string(), title: z.string().min(2).max(160), shortDescription: z.string().min(10).max(500), fullDescription: z.string().min(10).max(4000), targetAudience: z.string().min(2).max(500), ctaText: z.string().min(2).max(80), price: z.string().max(80).nullable().optional(), isPublished: z.boolean() }).safeParse(input);
  if (!parsed.success) return { success: false, message: "Service data is invalid." };
  const { id, ...serviceData } = parsed.data;
  const updated = await prisma.service.update({ where: { id }, data: serviceData });
  await audit("service.updated", id);
  revalidatePath("/services");
  revalidatePath(`/services/${updated.slug}`);
  revalidatePath("/");
  return { success: true, message: "Service updated." };
}

const serviceCreateSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(160),
  shortDescription: z.string().trim().min(10).max(500),
  fullDescription: z.string().trim().min(10).max(4000),
  targetAudience: z.string().trim().min(2).max(500),
  ctaText: z.string().trim().min(2).max(80),
  price: z.string().trim().max(80).nullable().optional(),
});

export async function createService(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before creating services." };
  const parsed = serviceCreateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Service data is invalid." };
  try {
    const service = await prisma.service.create({ data: { ...parsed.data, price: parsed.data.price || null, problemsSolved: [], deliverables: [], engagementProcess: [] } });
    await audit("service.created", service.id);
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, id: service.id, message: "Service created." };
  } catch {
    return { success: false, message: "The service could not be created. Slugs must be unique." };
  }
}

export async function deleteService(serviceId: string) {
  await requireRole(["OWNER"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before deleting services." };
  try {
    const service = await prisma.service.delete({ where: { id: serviceId } });
    await audit("service.deleted", serviceId, { slug: service.slug });
    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/");
    return { success: true, message: "Service deleted." };
  } catch {
    return { success: false, message: "The service could not be deleted." };
  }
}

export async function saveBlogPostDraft(input: unknown) {
  await requireRole();
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before saving articles." };
  const parsed = blogSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Article data is invalid." };
  const data = parsed.data;
  const content = sanitizeRichText(data.content);
  if (content.replace(/<[^>]*>/g, "").trim().length < 20) return { success: false, message: "Article content must contain at least 20 readable characters." };
  try {
    if (!data.id) {
      const post = await prisma.blogPost.create({ data: { slug: data.slug, title: data.title, excerpt: data.excerpt, content, category: data.category, status: "DRAFT", versions: { create: { version: 1, title: data.title, excerpt: data.excerpt, content, category: data.category } } } });
      await audit("blog.created", post.id);
      return { success: true, id: post.id, message: "Article draft created." };
    }
    const post = await prisma.blogPost.findUnique({ where: { id: data.id }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } });
    if (!post) return { success: false, message: "Article not found." };
    const version = (post.versions[0]?.version ?? 0) + 1;
    await prisma.$transaction([prisma.blogPost.update({ where: { id: data.id }, data: { slug: data.slug, title: data.title, excerpt: data.excerpt, content, category: data.category, status: "DRAFT" } }), prisma.blogPostVersion.create({ data: { blogPostId: data.id, version, title: data.title, excerpt: data.excerpt, content, category: data.category } })]);
    await audit("blog.draft_saved", data.id, { version });
    return { success: true, id: data.id, message: "Article draft saved." };
  } catch { return { success: false, message: "The article draft could not be saved." }; }
}

export async function publishBlogPost(postId: string) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before publishing articles." };
  const post = await prisma.blogPost.update({ where: { id: postId }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  await audit("blog.published", postId);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
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
  await prisma.siteSetting.upsert({ where: { key }, update: { value: parsedValue.data as Prisma.InputJsonValue }, create: { key: key, value: parsedValue.data as Prisma.InputJsonValue } });
  await audit("setting.updated", key);
  revalidatePath("/", "layout");
  return { success: true, message: "Setting updated." };
}

export async function updateSeoSettings(values: unknown) {
  await requireRole(["OWNER"]);
  const parsed = z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(320),
    ogImage: z.string().trim().url().or(z.string().trim().startsWith("/")),
  }).safeParse(values);
  if (!parsed.success) return { success: false, message: "SEO data is invalid." };
  
  if (!dbReady()) {
    setDemoSiteSetting("seo.settings", JSON.stringify(parsed.data));
    revalidatePath("/", "layout");
    return { success: true, message: "SEO settings updated for this running server." };
  }
  
  await prisma.siteSetting.upsert({
    where: { key: "seo.settings" },
    update: { value: parsed.data as Prisma.InputJsonValue },
    create: { key: "seo.settings", value: parsed.data as Prisma.InputJsonValue },
  });
  await audit("setting.updated", "seo.settings");
  revalidatePath("/", "layout");
  return { success: true, message: "SEO settings updated." };
}

export async function updateContactBudgetOptions(input: unknown) {
  await requireRole(["OWNER"]);
  const parsed = z.array(z.object({
    value: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: z.string().trim().min(1).max(120),
  })).min(1).max(20).safeParse(input);
  if (!parsed.success) return { success: false, message: "Add between 1 and 20 valid budget options." };
  
  const values = parsed.data.map((option) => option.value);
  if (new Set(values).size !== values.length || values.includes("custom")) {
    return { success: false, message: "Budget option values must be unique and cannot use the reserved custom value." };
  }
  
  if (!dbReady()) {
    setDemoSiteSetting("contact.budgetOptions", JSON.stringify(parsed.data));
    revalidatePath("/contact");
    return { success: true, message: "Budget options updated for this running server." };
  }
  
  await prisma.siteSetting.upsert({
    where: { key: "contact.budgetOptions" },
    update: { value: parsed.data as Prisma.InputJsonValue },
    create: { key: "contact.budgetOptions", value: parsed.data as Prisma.InputJsonValue },
  });
  await audit("setting.updated", "contact.budgetOptions");
  revalidatePath("/contact");
  return { success: true, message: "Budget options updated." };
}

export async function updateNavigationItems(input: unknown) {
  await requireRole(["OWNER"]);
  const parsed = z.array(z.object({ label: z.string().trim().min(1).max(60), href: z.string().trim().min(1).max(300) })).min(1).max(12).safeParse(input);
  if (!parsed.success || parsed.data.some((item) => !item.href.startsWith("/") && !/^https?:\/\//i.test(item.href))) return { success: false, message: "Navigation labels and internal or web URLs are required." };
  if (new Set(parsed.data.map((item) => item.href)).size !== parsed.data.length) return { success: false, message: "Navigation URLs must be unique." };
  const value = parsed.data;
  if (!dbReady()) setDemoSiteSetting("navigation.items", JSON.stringify(value));
  else await prisma.siteSetting.upsert({ where: { key: "navigation.items" }, update: { value: value as Prisma.InputJsonValue }, create: { key: "navigation.items", value: value as Prisma.InputJsonValue } });
  await audit("navigation.updated", "navigation.items");
  revalidatePath("/", "layout");
  return { success: true, message: "Navigation updated." };
}

export async function updatePricingPlans(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  const parsed = z.array(z.object({ id: z.string().trim().min(1).max(80), name: z.string().trim().min(2).max(120), price: z.string().trim().min(1).max(80), description: z.string().trim().min(10).max(500), features: z.array(z.string().trim().min(1).max(160)).max(20), type: z.enum(["fixed", "retainer"]), cta: z.string().trim().min(2).max(80) })).min(1).max(12).safeParse(input);
  if (!parsed.success) return { success: false, message: "Each package needs a name, price, description, type, CTA, and valid features." };
  const value = parsed.data;
  if (!dbReady()) setDemoSiteSetting("pricing.plans", JSON.stringify(value));
  else await prisma.siteSetting.upsert({ where: { key: "pricing.plans" }, update: { value: value as Prisma.InputJsonValue }, create: { key: "pricing.plans", value: value as Prisma.InputJsonValue } });
  await audit("pricing.updated", "pricing.plans");
  revalidatePath("/pricing");
  return { success: true, message: "Consulting packages updated." };
}

export async function saveCaseStudy(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before saving case studies." };
  
  const parsed = z.object({
    id: z.string().optional(),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(2).max(180),
    summary: z.string().trim().min(10).max(600),
    category: z.string().trim().min(2).max(80),
    businessProblem: z.string().trim().min(10).max(3000),
    role: z.string().trim().min(1).max(200),
    requirements: z.string().trim().min(1).max(2000),
    architecture: z.string().trim().min(1).max(2000),
    stack: z.array(z.string().trim().min(1).max(100)).max(50),
    implementation: z.string().trim().min(10).max(5000),
    challenges: z.string().trim().min(10).max(3000),
    outcomes: z.string().trim().min(10).max(2000),
    images: z.array(z.string().trim()).max(20),
    relatedServices: z.array(z.string().trim()).max(10),
    isPublished: z.boolean(),
    status: z.enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  }).safeParse(input);

  if (!parsed.success) return { success: false, message: "Case study data is invalid. Please check all required fields." };
  
  const data = parsed.data;
  try {
    if (!data.id) {
      const study = await prisma.caseStudy.create({ data });
      await audit("case_study.created", study.id);
      return { success: true, id: study.id, message: "Case study created." };
    }
    const study = await prisma.caseStudy.update({ where: { id: data.id }, data });
    await audit("case_study.updated", data.id);
    return { success: true, id: study.id, message: "Case study updated." };
  } catch (e) {
    return { success: false, message: "Could not save case study. Ensure the slug is unique." };
  }
}

export async function deleteCaseStudy(id: string) {
  await requireRole(["OWNER"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before deleting case studies." };
  try {
    await prisma.caseStudy.delete({ where: { id } });
    await audit("case_study.deleted", id);
    return { success: true, message: "Case study deleted." };
  } catch (e) {
    return { success: false, message: "Could not delete case study." };
  }
}

export async function updateCaseStudies(input: unknown) {
  return { success: false, message: "Please use saveCaseStudy for individual records." };
}

export async function saveEngagement(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before saving engagement models." };
  
  const parsed = z.object({
    id: z.string().optional(),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(2).max(160),
    description: z.string().trim().min(10).max(3000),
    price: z.string().trim().max(160),
    features: z.array(z.string().trim().min(1).max(160)).max(20),
    type: z.enum(["FIXED", "RETAINER", "HOURLY"]),
    ctaText: z.string().trim().min(2).max(80),
    isPublished: z.boolean(),
  }).safeParse(input);

  if (!parsed.success) return { success: false, message: "Engagement model data is invalid." };

  const data = parsed.data;
  try {
    if (!data.id) {
      const model = await prisma.engagementModel.create({ data });
      await audit("engagement_model.created", model.id);
      return { success: true, id: model.id, message: "Engagement model created." };
    }
    const model = await prisma.engagementModel.update({ where: { id: data.id }, data });
    await audit("engagement_model.updated", data.id);
    return { success: true, id: model.id, message: "Engagement model updated." };
  } catch (e) {
    return { success: false, message: "Could not save engagement model. Ensure the slug is unique." };
  }
}

export async function deleteEngagement(id: string) {
  await requireRole(["OWNER"]);
  if (!dbReady()) return { success: false, message: "Connect PostgreSQL before deleting engagement models." };
  try {
    await prisma.engagementModel.delete({ where: { id } });
    await audit("engagement_model.deleted", id);
    return { success: true, message: "Engagement model deleted." };
  } catch (e) {
    return { success: false, message: "Could not delete engagement model." };
  }
}

export async function updateTestimonials(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  const parsed = z.array(z.object({ id: z.string().trim().min(1).max(80), quote: z.string().trim().min(10).max(1000), name: z.string().trim().min(2).max(120), role: z.string().trim().min(2).max(120), company: z.string().trim().min(2).max(120), isPublished: z.boolean() })).max(30).safeParse(input);
  if (!parsed.success) return { success: false, message: "Case study data is invalid. Check slugs, summaries, outcomes, and metrics." };
  const value = parsed.data;
  if (!dbReady()) setDemoSiteSetting("testimonials.items", JSON.stringify(value));
  else await prisma.siteSetting.upsert({ where: { key: "testimonials.items" }, update: { value: value as Prisma.InputJsonValue }, create: { key: "testimonials.items", value: value as Prisma.InputJsonValue } });
  await audit("testimonials.updated", "testimonials.items");
  revalidatePath("/");
  return { success: true, message: "Testimonials updated." };
}

export async function updateLead(input: unknown) {
  await requireRole(["OWNER", "EDITOR"]);
  const parsed = z.object({ id: z.string().min(1), status: z.enum(["NEW", "QUALIFIED", "DISCOVERY_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"]), notes: z.string().max(5000) }).safeParse(input);
  if (!parsed.success || !dbReady()) return { success: false, message: parsed.success ? "Connect PostgreSQL before updating leads." : "Lead update is invalid." };
  await prisma.lead.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status, notes: parsed.data.notes.trim() || null } });
  await audit("lead.updated", parsed.data.id);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true, message: "Lead updated." };
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
    if (!isConfiguredAccount) return { success: true, message: "If that account exists, a reset email will be sent." };
    const token = createDemoResetToken();
    return { success: true, message: "Demo reset link created.", resetUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${token}` };
  }
  if (!dbReady()) return { success: false, message: "If that account exists, a reset email will be sent." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "If that account exists, a reset email will be sent." };
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60 * 1000) } });
  const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${rawToken}`;
  if (process.env.RESEND_API_KEY && process.env.BUSINESS_EMAIL && process.env.RESEND_FROM_EMAIL) {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [email], subject: "Reset your admin portal password", html: `<p>Reset your password within 30 minutes:</p><p><a href="${resetUrl}">Reset your password here</a></p>` }) }).catch(() => undefined);
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
