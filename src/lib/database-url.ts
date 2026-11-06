/** Runtime connections use the pooler; Prisma CLI keeps the direct schema URL. */
export function runtimeDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const pooled = env.DATABASE_URL_POOLED?.trim();
  const connection = pooled || env.DATABASE_URL?.trim();
  if (!connection) return undefined;
  try {
    const url = new URL(connection);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) return connection;
    // Prisma's direct and pooled endpoints use the same credentials/database.
    // Older marketplace installations do not provide DATABASE_URL_POOLED.
    if (!pooled && url.hostname === "db.prisma.io") url.hostname = "pooled.db.prisma.io";
    if (env.VERCEL === "1") {
      if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
      if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "15");
      if (!url.searchParams.has("pool_timeout")) url.searchParams.set("pool_timeout", "15");
    }
    return url.toString();
  } catch {
    // Let Prisma report invalid configuration without logging the credential.
    return connection;
  }
}
