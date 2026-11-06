export const DEFAULT_ADMIN_IDLE_MINUTES = 60;
export const MIN_ADMIN_IDLE_MINUTES = 5;
export const MAX_ADMIN_IDLE_MINUTES = 24 * 60;
// Cookie/JWT lifetime accommodates the longest permitted idle policy. The signed
// activity deadline is checked separately on every protected request.
export const ADMIN_SESSION_MAX_AGE = MAX_ADMIN_IDLE_MINUTES * 60;
export const ADMIN_IDLE_TIMEOUT_MS = DEFAULT_ADMIN_IDLE_MINUTES * 60_000;

export function validAdminIdleMinutes(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_ADMIN_IDLE_MINUTES && value <= MAX_ADMIN_IDLE_MINUTES;
}
export function adminIdleTimeoutMs(minutes: unknown) {
  return (validAdminIdleMinutes(minutes) ? minutes : DEFAULT_ADMIN_IDLE_MINUTES) * 60_000;
}
export function formatAdminIdleMinutes(minutes: number) {
  return minutes % 60 === 0 ? `${minutes / 60} hour${minutes === 60 ? "" : "s"}` : `${minutes} minutes`;
}
export function adminSessionExpired(token: Record<string, unknown>, now = Date.now()) {
  const last = token.lastActivityAt;
  return typeof last !== "number" || !Number.isFinite(last) || last > now + 30_000 || now - last >= adminIdleTimeoutMs(token.idleTimeoutMinutes);
}
