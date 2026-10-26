import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const publicAdminRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
  if (!request.nextUrl.pathname.startsWith("/admin") || publicAdminRoutes.includes(request.nextUrl.pathname)) return NextResponse.next();
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));
  if (process.env.DEMO_MODE !== "true") {
    const user = typeof token.email === "string" ? await prisma.user.findUnique({ where: { email: token.email }, select: { id: true } }).catch(() => null) : null;
    if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
