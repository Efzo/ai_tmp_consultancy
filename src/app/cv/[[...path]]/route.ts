// Legacy CVs contained personal details. Retire every historical CV URL rather
// than redirecting a search engine to another document containing those details.
export function GET() {
  return new Response("This document is no longer publicly available.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, nosnippet",
      "Cache-Control": "no-store",
    },
  });
}
