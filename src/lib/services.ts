import { services as fallbackServices, serviceAliases, type Service } from "@/data/services";
import { prisma } from "@/lib/prisma";

export type ManagedService = Service & {
  id?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  price?: string | null;
  isPublished?: boolean;
};

function databaseReady() {
  return process.env.DEMO_MODE !== "true" && Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("demo_");
}

export async function getManagedServices(): Promise<ManagedService[]> {
  if (!databaseReady()) return fallbackServices;
  try {
    const records = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
    if (!records.length && await prisma.siteSetting.findUnique({ where: { key: "consulting.initialized" } })) return [];
    return records.length ? records.filter((service) => service.isPublished && !Object.hasOwn(serviceAliases, service.slug)) : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function getManagedService(slug: string): Promise<ManagedService | undefined> {
  const services = await getManagedServices();
  return services.find((service) => service.slug === (serviceAliases[slug] ?? slug));
}
