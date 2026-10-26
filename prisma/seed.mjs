import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
const prisma = new PrismaClient();
const catalog = JSON.parse(await readFile(new URL("../src/data/consulting.json", import.meta.url), "utf8"));
const offers = JSON.parse(await readFile(new URL("../src/data/offers.json", import.meta.url), "utf8"));
try {
  await prisma.$transaction(async (tx) => {
    await tx.siteSetting.upsert({ where: { key: "consulting.initialized" }, create: { key: "consulting.initialized", value: true }, update: {} });
    for (const service of catalog.services) await tx.service.upsert({ where: { slug: service.slug }, update: {}, create: service });
    for (const model of catalog.engagements) await tx.engagementModel.upsert({ where: { slug: model.slug }, update: {}, create: model });
    const existing = await tx.caseStudy.findFirst({ where: { OR: [{ title: { contains: "clinc", mode: "insensitive" } }, { slug: { contains: "clinch", mode: "insensitive" } }] } });
    if (!existing) await tx.caseStudy.create({ data: catalog.caseStudy });
    await tx.siteSetting.upsert({ where: { key: "pricing.plans" }, update: {}, create: { key: "pricing.plans", value: offers } });
  });
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await prisma.user.upsert({ where: { email: process.env.ADMIN_EMAIL }, update: {}, create: { email: process.env.ADMIN_EMAIL, name: "Efosa Ojomo", role: "OWNER", password } });
  }
  console.log("Missing consulting records created; existing records preserved.");
} finally { await prisma.$disconnect(); }
