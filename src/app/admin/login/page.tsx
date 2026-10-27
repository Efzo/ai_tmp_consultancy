"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setPending(true);
    // Read the actual form fields, including browser/password-manager autofill.
    const form = new FormData(e.currentTarget);
    try {
      const res = await signIn('credentials', {
        email: String(form.get('email') ?? '').trim(),
        password: String(form.get('password') ?? ''),
        redirect: false,
      });
      if (!res?.ok || res.error) {
        setError(res?.error === 'CredentialsSignin' ? 'Sign-in failed. Check your email and saved account password, or use Forgot password.' : 'Sign-in is unavailable. Please try again shortly.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch { setError('Unable to reach the sign-in service. Please try again.'); }
    finally { setPending(false); }
  };

  return (
    <main className="min-h-screen bg-midnight flex items-center justify-center px-6">
      <div className="glass-panel p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin <span className="text-electric">Portal</span></h1>
          <p className="text-slate-muted text-sm">Sign in to access the content management system.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-xs font-medium text-slate-muted flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              id="admin-email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required
              className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
              placeholder="admin@ojomoefosa.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-xs font-medium text-slate-muted flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <div className="relative"><input
              id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
              className="w-full bg-white/5 border border-glass rounded-xl pl-4 pr-14 py-3 text-white focus:border-electric focus:outline-none transition-all"
              placeholder="••••••••"
            />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-muted hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-electric">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button></div>
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full py-3 font-bold disabled:opacity-60">
            {pending ? 'Signing in...' : 'Sign In to Console'}
          </button>
          <Link href="/admin/forgot-password" className="block text-center text-sm text-cyan-ai hover:text-white">Forgot password?</Link>
          <Link href="/admin/setup" className="block text-center text-sm text-slate-muted hover:text-white">First time here? Set up admin access</Link>
        </form>
      </div>
    </main>
  );
}
