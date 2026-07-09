'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, formatAuthError } from '@/hooks/useAuth';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  Mail, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Globe, 
  Moon, 
  Sun
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { dict, locale, toggleLocale, theme, toggleTheme } = useLocale();
  const { signInWithEmail, signInWithGoogle, signInAsDemo } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      setSuccess('Signed in successfully! Redirecting to your library...');
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setSuccess('Signed in with Google successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 relative overflow-hidden bg-[var(--bg-canvas)] transition-colors duration-300">
      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-[130px] pointer-events-none" />

      {/* Top Bar with Brand and Utilities */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center z-20 py-2">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg text-white font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            {dict.appTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200"
            title={dict.toggleLocale}
          >
            <Globe className="w-4 h-4" />
            <span>{locale === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] text-[var(--text-secondary)] transition-all duration-200"
            title={dict.toggleTheme}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Auth Card */}
      <main className="flex-1 flex items-center justify-center py-8 z-10">
        <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all duration-300 relative">
          
          {/* Top subtle ambient border light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[1px]" />

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {dict.welcomeBack}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-sm mx-auto">
              {dict.authSubtitle}
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                {dict.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  disabled={isBusy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                {dict.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isBusy}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{dict.signIn}</span>
              )}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="my-5 flex items-center">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="px-3 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={isBusy}
              onClick={handleGoogleLogin}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-[var(--text-primary)] transition disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
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
                  <span>{dict.continueWithGoogle}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={async () => {
                await signInAsDemo();
                setSuccess('Entering instant demo mode...');
                setTimeout(() => {
                  router.push('/');
                }, 600);
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600/10 to-teal-600/10 hover:from-emerald-600/20 hover:to-teal-600/20 border border-emerald-500/20 text-emerald-400 dark:text-emerald-300 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{dict.continueAsDemo}</span>
            </button>
          </div>

          {/* Toggle link to Sign Up */}
          <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
            <span>{dict.noAccountPrompt} </span>
            <Link href="/signup" className="text-blue-400 font-semibold hover:underline">
              {dict.signUp}
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-[var(--text-muted)] py-4 max-w-sm mx-auto leading-relaxed">
        {locale === 'ur' 
          ? 'تمام حقوق محفوظ ہیں۔ اردو نستعلیق اور کلاؤڈ سنک ورک سپیس کے ساتھ ایک بہترین تحریری تجربہ۔'
          : 'Designed for scholars & writers. Seamless Urdu Nastaliq and offline-first security.'}
      </footer>
    </div>
  );
}
