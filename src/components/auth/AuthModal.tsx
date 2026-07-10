'use client';

import React, { useState } from 'react';
import { useAuth, formatAuthError } from '@/hooks/useAuth';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { X, Lock, Mail, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { dict } = useLocale();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsDemo } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      setSuccess(isSignUp ? 'Account created! Welcome to Brain Library.' : 'Signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setSuccess('Signed in with Google successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-color)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {isSignUp ? dict.createAccount : dict.welcomeBack}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{dict.authSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success State Banner */}
        {success && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={isBusy}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hamza (Researcher)"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>
          )}

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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
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
                type="password"
                required
                disabled={isBusy}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
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
                <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isSignUp ? dict.signUp : dict.signIn}</span>
            )}
          </button>
        </form>

        <div className="my-5 flex items-center">
          <div className="flex-1 h-px bg-[var(--border-color)]" />
          <span className="px-3 text-xs text-[var(--text-secondary)] uppercase">OR</span>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={isBusy}
            onClick={handleGoogleAuth}
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
                <span>{dict.continueWithGoogle}</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={async () => {
              await signInAsDemo();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 text-emerald-500 dark:text-emerald-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>{dict.continueAsDemo}</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          <span>{isSignUp ? dict.haveAccountPrompt : dict.noAccountPrompt} </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
            className="text-blue-500 dark:text-blue-400 font-semibold hover:underline"
          >
            {isSignUp ? dict.signIn : dict.signUp}
          </button>
        </div>
      </div>
    </div>
  );
};
