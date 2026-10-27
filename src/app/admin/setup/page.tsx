"use client";

import { useState } from "react";
import Link from "next/link";
import { requestAdminAccount } from "@/app/actions/cms";

export default function AdminSetupPage() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setPending(true); setMessage("");
    try { setMessage((await requestAdminAccount(email)).message); }
    catch { setMessage("Unable to request account setup. Please try again shortly."); }
    finally { setPending(false); }
  }

  return <main className="flex min-h-[620px] items-center justify-center px-6 py-20">
    <div className="glass-panel w-full max-w-md p-8">
      <h1 className="text-3xl font-bold">Set up admin access</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-muted">Enter your approved administrator email. We will email a secure link so you can verify your address and choose your password.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label htmlFor="setup-email" className="block text-sm text-slate-muted">Email address</label>
        <input id="setup-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required className="w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" />
        <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Sending request..." : "Email my setup link"}</button>
      </form>
      {message && <p role="status" className="mt-5 text-sm text-cyan-ai">{message}</p>}
      <p className="mt-5 text-sm text-slate-muted">Already have an account? Use your saved password or reset it.</p>
      <div className="mt-5 flex flex-wrap justify-between gap-4 text-sm"><Link href="/admin/login" className="text-cyan-ai hover:text-white">Back to login</Link><Link href="/admin/forgot-password" className="text-cyan-ai hover:text-white">Forgot password?</Link></div>
    </div>
  </main>;
}
