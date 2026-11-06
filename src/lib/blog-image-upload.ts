export const blogImageTypes = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];
export const blogImageMaxBytes = 10 * 1024 * 1024;
export function blogImagePathAllowed(pathname: string, userId: string) {
  const prefix = `media/blog/${userId}/`;
  return pathname.startsWith(prefix) && /^[a-f0-9-]{36}\/[a-zA-Z0-9._-]{1,200}$/.test(pathname.slice(prefix.length));
}
export async function readUploadResponse(response: Response) {
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); } catch {
    if (response.status === 413) throw new Error("The upload request was too large. Try one smaller image at a time.");
    if (response.status === 401) throw new Error("Your session has expired. Sign in again before uploading.");
    throw new Error("The upload service did not respond correctly. Please try again; your article text is unchanged.");
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("The upload service returned an unexpected response. Please try again.");
  if (!response.ok) throw new Error(typeof result?.message === "string" ? result.message : "The image could not be uploaded. Please try again.");
  return result;
}
