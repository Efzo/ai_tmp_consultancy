"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const serviceSlugs = ["ai-strategy", "fractional-tpm", "solution-architecture", "enterprise-search", "ai-audit"] as const;
const recentSubmissions = new Map<string, number>();

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(160),
  website: z.union([z.literal(""), z.string().trim().url().max(300)]),
  service: z.enum(serviceSlugs),
  challenge: z.string().trim().min(20).max(5000),
  timeline: z.enum(["immediate", "short-term", "long-term"]),
  budget: z.enum(["undetermined", "5k-15k", "15k-50k", "50k-plus"]),
  consent: z.literal("on"),
  botField: z.string().max(0),
});

type ActionResult = { success: boolean; message: string };

async function sendLeadEmails(data: z.infer<typeof inquirySchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const businessEmail = process.env.BUSINESS_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !businessEmail || !fromEmail || apiKey.includes("demo_")) return;

  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const payload = (to: string, subject: string, html: string) => ({ from: fromEmail, to: [to], subject, html });
  const summary = `<p><strong>${data.name}</strong> from <strong>${data.company}</strong> submitted an inquiry for <strong>${data.service}</strong>.</p><p>${data.challenge}</p>`;

  try {
    const responses = await Promise.all([
      fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(payload(businessEmail, `New consulting inquiry from ${data.company}`, summary)) }),
      fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(payload(data.email, "We received your consulting inquiry", `<p>Thanks for reaching out. Your inquiry has been received and will be reviewed shortly.</p>`)) }),
    ]);
    if (responses.some((response) => !response.ok)) console.error("Lead email notification was rejected by the provider.");
  } catch {
    console.error("Lead email notification could not be sent.");
  }
}

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    website: formData.get("website") ?? "",
    service: formData.get("service"),
    challenge: formData.get("challenge"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget") ?? "undetermined",
    consent: formData.get("consent"),
    botField: formData.get("bot-field") ?? "",
  });

  if (!parsed.success) return { success: false, message: "Please complete every required field and consent to being contacted." };
  const data = parsed.data;
  const rateKey = data.email.toLowerCase();
  const lastSubmission = recentSubmissions.get(rateKey) ?? 0;
  if (Date.now() - lastSubmission < 60_000) return { success: false, message: "Please wait a minute before submitting another inquiry." };
  recentSubmissions.set(rateKey, Date.now());

  if (process.env.DEMO_MODE === "true") {
    return { success: true, message: "Demo inquiry received. Connect a database and email provider before accepting production leads." };
  }

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("demo_")) {
    return { success: false, message: "Lead storage is not configured yet. Please use the booking link or contact the site owner." };
  }

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website || null,
        serviceRequested: data.service,
        challenge: data.challenge,
        timeline: data.timeline,
        budget: data.budget,
        leadSource: "website-contact-form",
        consentAt: new Date(),
      },
    });
    await sendLeadEmails(data);
    return { success: true, message: "Your inquiry has been received. We will be in touch shortly." };
  } catch (error) {
    console.error("Lead persistence failed.", error instanceof Error ? error.message : "Unknown database error");
    return { success: false, message: "We could not save your inquiry right now. Please try again or book a call directly." };
  }
}
