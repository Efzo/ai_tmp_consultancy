"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/cms";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const result = await requestPasswordReset(email); setMessage(result.message); setResetUrl(result.resetUrl ?? ""); };
  return <main className="flex min-h-[620px] items-center justify-center px-6 py-20"><div className="glass-panel w-full max-w-md p-8"><h1 className="text-3xl font-bold">Reset <span className="text-electric">Password</span></h1><p className="mt-3 text-sm leading-relaxed text-slate-muted">Enter your administrator email to request a secure reset link.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm text-slate-muted">Email address<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none focus:border-electric" /></label><button className="btn-primary w-full">Request reset link</button></form>{message && <p className="mt-5 text-sm text-cyan-ai">{message}</p>}{resetUrl && <Link href={resetUrl} className="mt-4 block break-all rounded-lg border border-electric/30 bg-electric/10 p-3 text-sm text-cyan-ai">Open demo reset link →</Link>}<Link href="/admin/login" className="mt-6 block text-center text-sm text-slate-muted hover:text-white">Back to login</Link></div></main>;
}
