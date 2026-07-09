'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dictionary, Locale, dictionaries } from './dictionaries';

interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  setLocale: (loc: Locale) => void;
  toggleLocale: () => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Restore from localStorage if available
    const savedLocale = localStorage.getItem('brain_locale') as Locale;
    if (savedLocale === 'en' || savedLocale === 'ur') {
      setLocaleState(savedLocale);
    }
    const savedTheme = localStorage.getItem('brain_theme') as 'dark' | 'light';
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeState(savedTheme);
    } else {
      setThemeState('dark'); // Default to stunning dark mode
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('brain_locale', locale);
    // Dynamically set RTL or LTR on root html element
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('dir', locale === 'ur' ? 'rtl' : 'ltr');
    htmlEl.setAttribute('lang', locale);
    if (locale === 'ur') {
      htmlEl.classList.add('font-nastaliq');
    } else {
      htmlEl.classList.remove('font-nastaliq');
    }
  }, [locale, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('brain_theme', theme);
    const htmlEl = document.documentElement;
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    } else {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
    }
  }, [theme, mounted]);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dict: dictionaries[locale],
        setLocale,
        toggleLocale,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
