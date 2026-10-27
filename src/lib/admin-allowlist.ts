/** Server-side enrollment policy. Never expose this list to the browser. */
export function isApprovedAdminEmail(email: string) {
  const approved = `${process.env.ADMIN_EMAIL ?? ""},${process.env.ADMIN_EMAILS ?? ""}`
    .split(/[;,\n]/).map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return approved.includes(email.trim().toLowerCase());
}
