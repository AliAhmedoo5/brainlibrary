'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Note } from '@/types/note';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditorModal } from '@/components/notes/NoteEditorModal';
import { CategoryModal } from '@/components/categories/CategoryModal';
import { SearchModal } from '@/components/layout/SearchModal';
import { ShortcutsModal } from '@/components/layout/ShortcutsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { TrashView } from '@/components/notes/TrashView';
import {
  Plus,
  Sparkles,
  Pin,
  FileText,
  Filter,
  LogIn,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DashboardShell: React.FC = () => {
  const { dict, locale } = useLocale();
  const { user, loading, isDemo } = useAuth();
  const router = useRouter();
  const {
    notes,
    trashedNotes,
    saveNote,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete,
    purgeTrash
  } = useNotes();
  const { categories, saveCategory } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'notes' | 'trash'>('notes');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal States
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingNote(null);
        setIsNoteModalOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setMobileSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live note counts per category
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      if (n.categoryId) {
        counts[n.categoryId] = (counts[n.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [notes]);

  // Filter notes by selected category
  const filteredNotes = useMemo(() => {
    if (!selectedCategoryId) return notes;
    return notes.filter((n) => n.categoryId === selectedCategoryId);
  }, [notes, selectedCategoryId]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes]
  );
  const regularNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes]
  );

  const currentCategoryObj = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const handleTogglePin = (note: Note) => {
    saveNote({
      ...note,
      isPinned: !note.isPinned,
      updatedAt: Date.now()
    });
  };

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      router.replace('/login');
    }
  }, [loading, user, isDemo, router]);

  if (loading || (!user && !isDemo)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Checking workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onOpenNewCategoryModal={() => setIsCategoryModalOpen(true)}
        activeView={activeView}
        onChangeView={setActiveView}
        noteCounts={noteCounts}
        totalNotesCount={notes.length}
        trashedNotesCount={trashedNotes.length}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenNewNote={() => {
            setEditingNote(null);
            setIsNoteModalOpen(true);
          }}
          onToggleSidebarMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Demo Notice Bar */}
        {isDemo && (
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {locale === 'ur'
                  ? 'ڈیمو موڈ فعال ہے • اپنا ڈیٹا کلاؤڈ پر محفوظ کرنے کے لیے سائن اپ کریں'
                  : 'You are viewing Brain Library in Demo Mode. Create an account to save across devices.'}
              </span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" />
              <span>{dict.signIn} / {dict.signUp}</span>
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeView === 'trash' ? (
            <TrashView
              trashedNotes={trashedNotes}
              categories={categories}
              onRestore={restoreFromTrash}
              onPermanentDelete={(n) => permanentlyDelete(n.id)}
              onEmptyTrash={purgeTrash}
            />
          ) : (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
                    {currentCategoryObj ? (
                      <>
                        <span className="text-3xl">{currentCategoryObj.emoji}</span>
                        <span>{currentCategoryObj.name}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        <span>{dict.allNotes}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {currentCategoryObj
                      ? `Filtered section showing ${filteredNotes.length} note(s)`
                      : `${notes.length} note(s) stored in your bilingual library`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedCategoryId && (
                    <button
                      onClick={() => setSelectedCategoryId(null)}
                      className="px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition flex items-center gap-1.5"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Show All</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setIsNoteModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{dict.newNote}</span>
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {filteredNotes.length === 0 ? (
                <div className="studio-surface rounded-3xl p-12 sm:p-16 text-center border border-[var(--border-color)] max-w-xl mx-auto my-12 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 text-blue-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{dict.noNotesTitle}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">{dict.noNotesSubtitle}</p>
                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setIsNoteModalOpen(true);
                    }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{dict.newNote}</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Pinned Notes Grid */}
                  {pinnedNotes.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Pin className="w-4 h-4 fill-current" />
                        <span>{dict.pinnedSection}</span>
                        <span className="text-gray-500 font-normal">({pinnedNotes.length})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pinnedNotes.map((note) => {
                          const cat = categories.find((c) => c.id === note.categoryId);
                          return (
                            <NoteCard
                              key={note.id}
                              note={note}
                              category={cat}
                              onClick={() => {
                                setEditingNote(note);
                                setIsNoteModalOpen(true);
                              }}
                              onTogglePin={handleTogglePin}
                              onTrash={moveToTrash}
                            />
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Regular Notes Grid */}
                  {regularNotes.length > 0 && (
                    <section className="space-y-4">
                      {pinnedNotes.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pt-4">
                          <span>{dict.otherNotesSection}</span>
                          <span className="text-gray-500 font-normal">({regularNotes.length})</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {regularNotes.map((note) => {
                          const cat = categories.find((c) => c.id === note.categoryId);
                          return (
                            <NoteCard
                              key={note.id}
                              note={note}
                              category={cat}
                              onClick={() => {
                                setEditingNote(note);
                                setIsNoteModalOpen(true);
                              }}
                              onTogglePin={handleTogglePin}
                              onTrash={moveToTrash}
                            />
                          );
                        })}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <NoteEditorModal
        note={editingNote}
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={saveNote}
        onTrash={moveToTrash}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={saveCategory}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectNote={(note) => {
          setEditingNote(note);
          setIsNoteModalOpen(true);
        }}
        categories={categories}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
