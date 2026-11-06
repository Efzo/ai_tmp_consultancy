import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/admin-session";

type TimerHandle = ReturnType<typeof setTimeout> | number;

/** Wall-clock checks also catch suspended tabs and computers waking from sleep. */
export function createAdminIdleTimer(options: {
  lastActivity: number;
  timeoutMs?: number;
  onExpire: () => void;
  readSharedActivity: () => number;
  now?: () => number;
  schedule?: (callback: () => void, delay: number) => TimerHandle;
  cancel?: (timer: TimerHandle) => void;
}) {
  const timeoutMs = options.timeoutMs ?? ADMIN_IDLE_TIMEOUT_MS;
  const now = options.now ?? Date.now;
  const schedule = options.schedule ?? setTimeout;
  const cancel = options.cancel ?? clearTimeout;
  let lastActivity = options.lastActivity;
  let stopped = false;
  let timer: TimerHandle | undefined;
  function adoptSharedActivity() {
    const shared = options.readSharedActivity();
    if (Number.isFinite(shared) && shared <= now() && shared > lastActivity) lastActivity = shared;
  }
  function arm() {
    if (timer !== undefined) cancel(timer);
    timer = schedule(check, Math.max(0, lastActivity + timeoutMs - now()));
  }
  function check() {
    if (stopped) return false;
    adoptSharedActivity();
    if (now() - lastActivity >= timeoutMs) {
      stopped = true;
      if (timer !== undefined) cancel(timer);
      options.onExpire();
      return false;
    }
    arm();
    return true;
  }
  function activity() {
    if (!check()) return false; // An expired session cannot be revived by a late click.
    lastActivity = now();
    arm();
    return true;
  }
  check();
  return { activity, check, stop() { stopped = true; if (timer !== undefined) cancel(timer); } };
}
