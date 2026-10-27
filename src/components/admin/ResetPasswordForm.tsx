"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { resetPassword } from "@/app/actions/cms";

export default function ResetPasswordForm({ token, setup = false }: { token: string; setup?: boolean }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const confirmationHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (complete) confirmationHeading.current?.focus(); }, [complete]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    if (password !== confirm) return setMessage("Passwords do not match.");
    setPending(true); setMessage("");
    try { const result = await resetPassword(token, password); setMessage(result.message); setComplete(result.success); if (result.success) { setPassword(""); setConfirm(""); } }
    catch { setMessage("Unable to update your password. Please try again shortly."); }
    finally { setPending(false); }
  };
  return <main className="flex min-h-[620px] items-center justify-center px-6 py-20">
    <div className="glass-panel w-full max-w-md p-8">
      {complete ? <div className="text-center">
        <CircleCheck aria-hidden="true" className="mx-auto mb-6 h-14 w-14 text-emerald-400" />
        <h1 ref={confirmationHeading} tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none">{setup ? "Your admin account is ready" : "Password updated successfully"}</h1>
        <p role="status" className="mt-4 text-sm leading-relaxed text-slate-muted">{setup ? "Your email is verified and your password has been saved. You can now sign in to manage your website." : "Your new password has been saved. Sign in to your admin account using your new password."}</p>
        <Link href="/admin/login" className="btn-primary mt-8 flex w-full justify-center">Sign in to admin</Link>
        <p className="mt-5 text-xs leading-relaxed text-slate-muted">This link has been used. You can close this page after signing in.</p>
      </div> : <>
        <h1 className="text-3xl font-bold">{setup ? "Create your" : "Set a new"} <span className="text-electric">Password</span></h1>
        <p className="mt-3 text-sm text-slate-muted">Use at least 8 characters.</p>
        {!token && <p role="alert" className="mt-5 text-sm text-red-400">This link is missing its reset token. Request a new link from Forgot password.</p>}
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm text-slate-muted">New password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label>
          <label className="block text-sm text-slate-muted">Confirm password<input value={confirm} onChange={(event) => setConfirm(event.target.value)} type="password" autoComplete="new-password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label>
          <button disabled={pending || !token} className="btn-primary w-full disabled:opacity-60">{pending ? "Saving password..." : setup ? "Create my password" : "Update password"}</button>
        </form>
        {message && <p role="alert" className="mt-5 text-sm text-red-400">{message}</p>}
        <Link href="/admin/login" className="mt-6 block text-center text-sm text-slate-muted hover:text-white">Back to login</Link>
      </>}
    </div>
  </main>;
}
