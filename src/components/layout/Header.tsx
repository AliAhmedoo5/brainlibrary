'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuth } from '@/hooks/useAuth';
import { AppLogoIcon } from '@/components/ui/AppLogoIcon';
import {
  Search,
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  Menu,
  LogOut,
  Plus
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNewNote: () => void;
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNewNote,
  onToggleSidebarMobile
}) => {
  const { dict, locale, toggleLocale, theme, toggleTheme } = useLocale();
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 studio-surface border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between gap-4 backdrop-blur-md">
      {/* Left side: Mobile menu & Search box */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <AppLogoIcon className="w-8 h-8 lg:hidden shrink-0" />

        {/* Search button for mobile */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-blue-500" />
        </button>

        {/* Search bar for desktop */}
        <div
          onClick={onOpenSearch}
          className="hidden sm:flex flex-1 items-center justify-between bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 cursor-pointer transition group"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
            <Search className="w-4 h-4 text-blue-500" />
            <span className="text-xs sm:text-sm truncate">{dict.searchPlaceholder}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-color)]">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right side: New Note button, Language Toggle, Theme Toggle, Online Status, User */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick New Note CTA */}
        <button
          type="button"
          onClick={onOpenNewNote}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{dict.newNote}</span>
        </button>

        {/* Language / RTL Toggle */}
        <button
          type="button"
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition"
          title={dict.toggleLocale}
        >
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline">{locale === 'en' ? 'اردو RTL' : 'English LTR'}</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-[var(--text-primary)] transition"
          title={dict.toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>

        {/* Online / Offline status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] font-medium">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[var(--text-secondary)]">{dict.onlineBadge}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400">{dict.offlineBadge}</span>
            </>
          )}
        </div>

        {/* User Profile / Logout */}
        {user ? (
          <div className="flex items-center gap-2 ps-2 border-s border-[var(--border-color)]">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight truncate max-w-[120px]">
                {user.displayName}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[120px]">
                {user.email}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition"
              title={dict.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
