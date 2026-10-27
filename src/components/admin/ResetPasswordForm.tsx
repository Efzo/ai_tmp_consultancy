"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/cms";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match.");
    setPending(true); setMessage("");
    try { const result = await resetPassword(token, password); setMessage(result.message); setComplete(result.success); if (result.success) { setPassword(""); setConfirm(""); } }
    catch { setMessage("Unable to update your password. Please try again shortly."); }
    finally { setPending(false); }
  };
  return <main className="flex min-h-[620px] items-center justify-center px-6 py-20"><div className="glass-panel w-full max-w-md p-8"><h1 className="text-3xl font-bold">Set a new <span className="text-electric">Password</span></h1><p className="mt-3 text-sm text-slate-muted">Use at least 8 characters (maximum 72 UTF-8 bytes).</p>{!token && <p role="alert" className="mt-5 text-sm text-red-400">This link is missing its reset token. Request a new link from Forgot password.</p>}<form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm text-slate-muted">New password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Confirm password<input value={confirm} onChange={(event) => setConfirm(event.target.value)} type="password" autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label><button disabled={pending || complete || !token} className="btn-primary w-full disabled:opacity-60">{pending ? "Updating password..." : complete ? "Password updated" : "Update password"}</button></form>{message && <p role="status" className="mt-5 text-sm text-cyan-ai">{message}</p>}<Link href="/admin/login" className="mt-6 block text-center text-sm text-slate-muted hover:text-white">Back to login</Link></div></main>;
}
