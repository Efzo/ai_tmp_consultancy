import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { blogImageMaxBytes, blogImagePathAllowed, blogImageTypes } from "@/lib/blog-image-upload";
import { registerBlogImage } from "@/lib/register-blog-image";

const metadata = z.object({ filename: z.string().trim().min(1).max(200), alt: z.string().trim().min(2).max(300) });
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.DATABASE_URL || process.env.DEMO_MODE === "true") return NextResponse.json({ message: "Image storage is not configured." }, { status: 503 });
  let body: HandleUploadBody;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid upload request." }, { status: 400 }); }
  if (!body || !["blob.generate-client-token", "blob.upload-completed"].includes(body.type)) return NextResponse.json({ message: "Invalid upload request." }, { status: 400 });
  let user: { id?: string; role?: string } | undefined;
  if (body.type === "blob.generate-client-token") {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "Invalid upload origin." }, { status: 403 });
    const session = await getServerSession(authOptions);
    user = session?.user as typeof user;
    if (!user?.id || !["OWNER", "EDITOR"].includes(user.role ?? "")) return NextResponse.json({ message: "Sign in again before uploading an image." }, { status: 401 });
  }
  try {
    const result = await handleUpload({ request, body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!user?.id || !blogImagePathAllowed(pathname, user.id)) throw new Error("Invalid image path.");
        const values = metadata.parse(JSON.parse(clientPayload || "{}"));
        return { allowedContentTypes: blogImageTypes, maximumSizeInBytes: blogImageMaxBytes, addRandomSuffix: true, allowOverwrite: false, validUntil: Date.now() + 15 * 60_000, tokenPayload: JSON.stringify({ ...values, userId: user.id }) };
      },
      // Blob verifies its signed completion callback; no browser session is needed here.
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const values = metadata.extend({ userId: z.string().min(1).max(100) }).parse(JSON.parse(tokenPayload || "{}"));
        await registerBlogImage({ pathname: blob.pathname, ...values });
      },
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "The image upload could not be authorized or completed. Please try again." }, { status: body.type === "blob.upload-completed" ? 500 : 400 });
  }
}
