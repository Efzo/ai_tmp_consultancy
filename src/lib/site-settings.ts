import { prisma } from "@/lib/prisma";

export const footerSettingDefaults = {
  linkedinUrl: "https://linkedin.com/in/efosa-o-4882a015a/",
  articlesUrl: "/blog",
  allServicesUrl: "/services",
  aiStrategyUrl: "/services/ai-strategy",
  fractionalTpmUrl: "/services/fractional-tpm",
  aiArchitectureUrl: "/services/solution-architecture",
  aboutUrl: "/about",
  processUrl: "/process",
  caseStudiesUrl: "/case-studies",
  contactUrl: "/contact",
  privacyUrl: "/privacy",
  termsUrl: "/terms",
} as const;

export type FooterSettings = Record<keyof typeof footerSettingDefaults, string>;

const demoOverrides = new Map<string, string>();

function dbReady() {
  return process.env.DEMO_MODE !== "true" && Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("demo_");
}

function settingKey(key: keyof typeof footerSettingDefaults) {
  return `footer.${key}`;
}

export function getDefaultFooterSettings(): FooterSettings {
  return Object.fromEntries(
    Object.entries(footerSettingDefaults).map(([key, value]) => [key, demoOverrides.get(settingKey(key as keyof typeof footerSettingDefaults)) ?? value]),
  ) as FooterSettings;
}

export async function getFooterSettings(): Promise<FooterSettings> {
  const defaults = getDefaultFooterSettings();
  if (!dbReady()) return defaults;

  try {
    const records = await prisma.siteSetting.findMany({ where: { key: { startsWith: "footer." } } });
    for (const record of records) {
      const key = record.key.replace(/^footer\./, "") as keyof typeof footerSettingDefaults;
      if (key in defaults && typeof record.value === "string") defaults[key] = record.value;
    }
  } catch {
    return defaults;
  }

  return defaults;
}

export function setDemoSiteSetting(key: string, value: string) {
  demoOverrides.set(key, value);
}

export function isSiteSettingsDatabaseReady() {
  return dbReady();
}
