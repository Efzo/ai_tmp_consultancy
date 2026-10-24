import { services as fallbackServices, type Service } from "@/data/services";
import { prisma } from "@/lib/prisma";

export type ManagedService = Service & {
  id?: string;
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
    return records.length ? records.filter((service) => service.isPublished) : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function getManagedService(slug: string): Promise<ManagedService | undefined> {
  if (!databaseReady()) return fallbackServices.find((service) => service.slug === slug);
  try {
    const records = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
    if (records.length) return records.find((service) => service.slug === slug && service.isPublished);
    return fallbackServices.find((service) => service.slug === slug);
  } catch {
    return fallbackServices.find((service) => service.slug === slug);
  }
}
