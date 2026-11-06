import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { blogImagePathAllowed } from "@/lib/blog-image-upload";
import { registerBlogImage } from "@/lib/register-blog-image";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || !["OWNER", "EDITOR"].includes(user.role ?? "")) return NextResponse.json({ message: "Sign in again before attaching the image." }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "Invalid upload origin." }, { status: 403 });
  try {
    const input = z.object({ pathname: z.string().max(400), filename: z.string().trim().min(1).max(200), alt: z.string().trim().min(2).max(300) }).parse(await request.json());
    if (!blogImagePathAllowed(input.pathname, user.id)) return NextResponse.json({ message: "Invalid image path." }, { status: 400 });
    const asset = await registerBlogImage({ ...input, userId: user.id });
    return NextResponse.json({ asset });
  } catch {
    return NextResponse.json({ message: "The image could not be attached. Retry the upload; your article text is unchanged." }, { status: 400 });
  }
}
