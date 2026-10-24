"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/cms";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (password !== confirm) return setMessage("Passwords do not match."); const result = await resetPassword(token, password); setMessage(result.message); };
  return <main className="flex min-h-[620px] items-center justify-center px-6 py-20"><div className="glass-panel w-full max-w-md p-8"><h1 className="text-3xl font-bold">Set a new <span className="text-electric">Password</span></h1><p className="mt-3 text-sm text-slate-muted">Use at least 8 characters.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm text-slate-muted">New password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label><label className="block text-sm text-slate-muted">Confirm password<input value={confirm} onChange={(event) => setConfirm(event.target.value)} type="password" minLength={8} required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label><button className="btn-primary w-full">Update password</button></form>{message && <p className="mt-5 text-sm text-cyan-ai">{message}</p>}<Link href="/admin/login" className="mt-6 block text-center text-sm text-slate-muted hover:text-white">Back to login</Link></div></main>;
}
