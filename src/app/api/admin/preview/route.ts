import { draftMode } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isManagedPageSlug, pagePath } from "@/lib/page-content-schema";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!["OWNER", "EDITOR"].includes((session?.user as { role?: string })?.role ?? "")) return new Response("Unauthorized", { status: 401 });
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "about";
  if (slug !== "home" && !isManagedPageSlug(slug)) return new Response("Unknown page", { status: 400 });
  const mode = await draftMode();
  if (url.searchParams.get("disable") === "1") mode.disable(); else mode.enable();
  return NextResponse.redirect(new URL(slug === "home" ? "/" : pagePath(slug), request.url));
}
