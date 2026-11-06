"use client";

import { useEffect, useRef, useState } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { adminIdleTimeoutMs } from "@/lib/admin-session";
import { createAdminIdleTimer } from "@/lib/admin-idle-timer";

const activityKey = "ojomo.admin.lastActivity";

function IdleGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [expired, setExpired] = useState(false);
  const loggingOut = useRef(false);
  const updateRef = useRef(update);
  const lastPulse = useRef(0);
  const inFlight = useRef(false);
  const deadline = (session as (typeof session & { idleExpiresAt?: number; idleTimeoutMinutes?: number }))?.idleExpiresAt;
  const timeoutMs = adminIdleTimeoutMs((session as (typeof session & { idleTimeoutMinutes?: number }))?.idleTimeoutMinutes);
  const identity = session?.user as { id?: string; role?: string } | undefined;
  const valid = Boolean(identity?.id && identity.role && typeof deadline === "number");

  useEffect(() => { updateRef.current = update; }, [update]);

  useEffect(() => {
    const loginUrl = `/admin/login?reason=idle&minutes=${timeoutMs / 60_000}`;
    function expire() {
      if (loggingOut.current) return;
      loggingOut.current = true;
      setExpired(true); // Remove the private UI even if the network is unavailable.
      const fallback = window.setTimeout(() => window.location.replace(loginUrl), 5_000);
      void signOut({ redirect: false }).catch(() => undefined).finally(() => {
        window.clearTimeout(fallback);
        window.location.replace(loginUrl);
      });
    }
    if (status === "unauthenticated" || (status === "authenticated" && !valid)) expire();
    if (!valid || typeof deadline !== "number" || expired) return;
    const readSharedActivity = () => {
      try { return Number(window.localStorage.getItem(activityKey)); } catch { return NaN; }
    };
    const monitor = createAdminIdleTimer({ lastActivity: deadline - timeoutMs, timeoutMs, onExpire: expire, readSharedActivity });
    let lastHandled = 0;
    let lastInteraction = 0;
    let trailing: ReturnType<typeof setTimeout> | undefined;
    const pulse = async () => {
      if (inFlight.current || lastInteraction <= lastPulse.current || !monitor.check()) return;
      inFlight.current = true;
      lastPulse.current = lastInteraction;
      try { await updateRef.current({ activity: true }); } catch { /* The server still enforces expiration. */ }
      finally { inFlight.current = false; }
    };
    const activity = (event: Event) => {
      if (!event.isTrusted || document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastHandled < 1_000 || !monitor.activity()) return;
      lastHandled = lastInteraction = now;
      try { window.localStorage.setItem(activityKey, String(now)); } catch { /* Single-tab expiry still works. */ }
      if (now - lastPulse.current >= 60_000) void pulse();
      if (trailing !== undefined) clearTimeout(trailing);
      trailing = setTimeout(() => { void pulse(); }, 1_500);
    };
    const check = () => { monitor.check(); };
    const storage = (event: StorageEvent) => { if (event.key === activityKey) check(); };
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "input", "click"];
    events.forEach((name) => window.addEventListener(name, activity, { passive: true, capture: true }));
    window.addEventListener("focus", check);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", check);
    return () => {
      monitor.stop();
      if (trailing !== undefined) clearTimeout(trailing);
      events.forEach((name) => window.removeEventListener(name, activity, true));
      window.removeEventListener("focus", check);
      window.removeEventListener("storage", storage);
      document.removeEventListener("visibilitychange", check);
    };
  }, [deadline, expired, status, valid, timeoutMs]);

  if (expired || (status !== "loading" && !valid)) return <main className="flex min-h-screen items-center justify-center bg-midnight text-platinum"><p role="status">Your session has expired. Returning to sign in…</p></main>;
  if (!valid) return <main className="flex min-h-screen items-center justify-center bg-midnight text-platinum"><p role="status">Checking your session…</p></main>;
  return children;
}

export default function AdminSessionBoundary({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}><IdleGuard>{children}</IdleGuard></SessionProvider>;
}
