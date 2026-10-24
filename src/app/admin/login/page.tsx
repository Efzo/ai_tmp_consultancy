"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid credentials. Please check your email and password.');
    } else {
      router.push('/admin');
      router.refresh();
    }
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
            <label className="text-xs font-medium text-slate-muted flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              type="email" required
              className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
              placeholder="admin@ojomoefosa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-muted flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              type="password" required
              className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 font-bold">
            Sign In to Console
          </button>
          <Link href="/admin/forgot-password" className="block text-center text-sm text-cyan-ai hover:text-white">Forgot password?</Link>
        </form>
      </div>
    </main>
  );
}
