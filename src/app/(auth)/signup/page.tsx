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
  Cloud, 
  Laptop, 
  Globe, 
  Moon, 
  Sun,
  User,
  ChevronDown,
  ChevronUp,
  FileCode2
} from 'lucide-react';
import Link from 'next/link';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function SignupPage() {
  const router = useRouter();
  const { dict, locale, toggleLocale, theme, toggleTheme } = useLocale();
  const { signUpWithEmail, signInWithGoogle, signInAsDemo } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Default to cloud sync if configured, otherwise local workspace
  const [activeTab, setActiveTab] = useState<'local' | 'cloud'>(
    isFirebaseConfigured ? 'cloud' : 'local'
  );
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      setSuccess(
        activeTab === 'local' 
          ? 'Local Workspace account created successfully! Redirecting...' 
          : 'Account created successfully! Welcome to Brain Library.'
      );
      setTimeout(() => {
        router.push('/');
      }, 800);
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
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* Top Header & Toggles */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center z-20 py-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center shadow-md text-white font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-base tracking-wide bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
            Brain Library
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200"
            title={dict.toggleLocale}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] text-[var(--text-secondary)] transition-all duration-200"
            title={dict.toggleTheme}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center py-8 z-10">
        <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all duration-300 relative">
          
          {/* Decorative Top Accent Light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-[1px]" />

          {/* Icon and Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {locale === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Create Account'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-sm mx-auto leading-relaxed">
              {dict.authSubtitle}
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] relative">
            <button
              type="button"
              onClick={() => setActiveTab('local')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 z-10 ${
                activeTab === 'local'
                  ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-500/90 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? 'مقامی ورک سپیس' : 'Local Workspace'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 z-10 ${
                activeTab === 'cloud'
                  ? 'bg-gradient-to-r from-teal-600/90 to-teal-500/90 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? 'کلاؤڈ سنک' : 'Cloud Sync'}</span>
            </button>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Tab Content 1: Local Workspace */}
          {activeTab === 'local' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-indigo-300 leading-normal flex items-start gap-2">
                <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-indigo-200">Local Workspace Active: </span>
                  Your profile and notes are saved securely on your device. Easily sync to the cloud later when needed.
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 text-xs disabled:opacity-50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
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
                    placeholder="local-user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 text-xs disabled:opacity-50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                  {dict.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isBusy}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 text-xs disabled:opacity-50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Workspace...</span>
                  </>
                ) : (
                  <span>{locale === 'ur' ? 'مقامی اکاؤنٹ بنائیں' : 'Create Local Workspace'}</span>
                )}
              </button>
            </form>
          )}

          {/* Tab Content 2: Cloud Sync */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              {!isFirebaseConfigured ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                    <Cloud className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-200 mb-0.5">Firebase Setup Required</p>
                      <p className="text-gray-400 text-[10px] leading-relaxed">
                        Cloud sync (Email/Google cloud signup) requires setting up credentials in your `.env.local` file. Currently, the build is running in static local-only mode.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full py-2 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:bg-[var(--bg-subtle-hover)] text-xs text-[var(--text-secondary)] flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>How to configure Cloud Sync?</span>
                    </span>
                    {showInstructions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showInstructions && (
                    <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-[9px] font-mono text-emerald-400/90 leading-normal max-h-48 overflow-y-auto space-y-2 animate-slideDown">
                      <p className="text-slate-400">// Create .env.local file in project root:</p>
                      <p>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...</p>
                      <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=app.firebaseapp.com</p>
                      <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=app-id</p>
                      <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=app.firebasestorage.app</p>
                      <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=995934502735</p>
                      <p>NEXT_PUBLIC_FIREBASE_APP_ID=1:995:web:93e7</p>
                      <p className="text-slate-400 mt-2">// Then run "npm run build" to sync</p>
                    </div>
                  )}

                  <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl text-[10px] text-teal-300 text-center">
                    Switch to the <span className="font-semibold text-teal-200">Local Workspace</span> tab or try the <span className="font-semibold text-teal-200">Instant Demo</span> below to start taking notes right now!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 text-xs disabled:opacity-50 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
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
                        placeholder="cloud-user@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 text-xs disabled:opacity-50 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      {dict.passwordLabel}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isBusy}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 text-xs disabled:opacity-50 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>{dict.signUp}</span>
                    )}
                  </button>

                  <div className="my-4 flex items-center">
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                    <span className="px-2.5 text-[9px] text-[var(--text-muted)] uppercase">OR</span>
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleGoogleSignup}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-[var(--text-primary)] transition disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="px-2.5 text-[9px] text-[var(--text-muted)] uppercase">OR</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          {/* Demo Choice */}
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
            className="w-full py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-teal-500/10 hover:from-indigo-500/20 hover:to-teal-500/20 border border-indigo-500/20 text-indigo-400 dark:text-indigo-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{dict.continueAsDemo}</span>
          </button>

          {/* Toggle link to Sign In */}
          <div className="mt-5 text-center text-xs text-[var(--text-secondary)]">
            <span>{dict.haveAccountPrompt} </span>
            <Link 
              href="/login" 
              className={`font-semibold hover:underline ${activeTab === 'local' ? 'text-indigo-400' : 'text-teal-400'}`}
            >
              {dict.signIn}
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
