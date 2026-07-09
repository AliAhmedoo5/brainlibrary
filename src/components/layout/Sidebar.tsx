'use client';

import React from 'react';
import { Category } from '@/types/category';
import { useLocale } from '@/lib/i18n/LocaleContext';
import {
  BookOpen,
  Trash2,
  Plus,
  Layers,
  Keyboard,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenNewCategoryModal: () => void;
  activeView: 'notes' | 'trash';
  onChangeView: (view: 'notes' | 'trash') => void;
  noteCounts: Record<string, number>;
  totalNotesCount: number;
  trashedNotesCount: number;
  onOpenShortcuts: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenNewCategoryModal,
  activeView,
  onChangeView,
  noteCounts,
  totalNotesCount,
  trashedNotesCount,
  onOpenShortcuts,
  mobileOpen,
  onCloseMobile
}) => {
  const { dict } = useLocale();

  const navItemClass = (active: boolean) =>
    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
      active
        ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold shadow-sm'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md text-white font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
              {dict.appTitle}
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Offline-First</span>
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <div className="p-4 space-y-1.5">
        <button
          type="button"
          onClick={() => {
            onChangeView('notes');
            onSelectCategory(null);
            onCloseMobile();
          }}
          className={navItemClass(activeView === 'notes' && selectedCategoryId === null)}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>{dict.allNotes}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            {totalNotesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onChangeView('trash');
            onCloseMobile();
          }}
          className={navItemClass(activeView === 'trash')}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>{dict.trash}</span>
          </div>
          {trashedNotesCount > 0 && (
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400">
              {trashedNotesCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories / Sections Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {dict.categories}
        </span>
        <button
          type="button"
          onClick={onOpenNewCategoryModal}
          className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          title={dict.newCategory}
        >
          <Plus className="w-4 h-4 text-blue-500" />
        </button>
      </div>

      {/* Categories Feed */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {categories.map((cat) => {
          const count = noteCounts[cat.id] || 0;
          const isActive = activeView === 'notes' && selectedCategoryId === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => {
                onChangeView('notes');
                onSelectCategory(cat.id);
                onCloseMobile();
              }}
              className={navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-base">{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Banner & Shortcuts CTA */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-500" />
            <span>{dict.shortcutsModalTitle}</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Ctrl+K</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen shrink-0 studio-surface border-r border-[var(--border-color)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 z-50 w-72 studio-surface border-r border-[var(--border-color)] transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
