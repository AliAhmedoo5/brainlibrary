'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, formatAuthError } from '@/hooks/useAuth';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Mail, Lock, Sparkles, BookOpen, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, CloudOff, User } from 'lucide-react';
import Link from 'next/link';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function SignupPage() {
  const router = useRouter();
  const { dict } = useLocale();
  const { signUpWithEmail, signInWithGoogle, signInAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      setSuccess('Account created successfully! Welcome to Brain Library.');
      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!isFirebaseConfigured) return;
    setError('');
    setSuccess('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setSuccess('Signed up with Google successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-canvas)]">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all duration-300 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">{dict.appTitle}</h1>
            <p className="text-xs text-[var(--text-secondary)]">{dict.createAccount}</p>
          </div>
        </div>

        {/* Firebase Config warning / Mode Selector */}
        {!isFirebaseConfigured && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3 animate-fadeIn">
            <CloudOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200 mb-0.5">Local Mode Active</p>
              <p className="text-gray-400 leading-normal">Cloud sync (Email/Google signup) is disabled because Firebase credentials are not configured in `.env.local`. You can start writing instantly in offline-first Demo Mode.</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Demo Mode - Primary choice if Firebase isn't configured */}
        {!isFirebaseConfigured ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={async () => {
                await signInAsDemo();
                router.push('/');
              }}
              className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{dict.continueAsDemo}</span>
            </button>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-500">All features (Urdu Nastaliq, local storage, rich-text editor, categories) are fully functional offline.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  disabled={isBusy}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hamza (Scholar)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                {dict.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  disabled={isBusy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                {dict.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isBusy}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>{dict.signUp}</span>
              )}
            </button>
          </form>
        )}

        {isFirebaseConfigured && (
          <>
            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="px-3 text-[10px] text-[var(--text-muted)] uppercase">OR</span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={isBusy}
                onClick={handleGoogleSignup}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-[var(--text-primary)] transition disabled:opacity-50 flex items-center justify-center gap-2.5"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Connecting Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={async () => {
                  await signInAsDemo();
                  router.push('/');
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600/10 to-teal-600/10 hover:from-emerald-600/20 hover:to-teal-600/20 border border-emerald-500/20 text-emerald-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{dict.continueAsDemo}</span>
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
              <span>{dict.haveAccountPrompt} </span>
              <Link href="/login" className="text-blue-400 font-semibold hover:underline">
                {dict.signIn}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
