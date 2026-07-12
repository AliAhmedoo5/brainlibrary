'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { Category } from '@/types/category';
import { searchService } from '@/lib/search';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Search, X, Tag as TagIcon, FileText } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: Note) => void;
  categories: Category[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNote,
  categories
}) => {
  const { dict } = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
    setResults(searchService.search(''));
  }, [isOpen]);

  useEffect(() => {
    const res = searchService.search(query);
    setResults(res);
  }, [query]);

  if (!isOpen) return null;

  const getCategoryName = (catId: string | null) => {
    if (!catId) return dict.uncategorized;
    const found = categories.find((c) => c.id === catId);
    return found ? `${found.emoji} ${found.name}` : dict.uncategorized;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-color)] flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
          <Search className="w-5 h-5 text-blue-400 me-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm sm:text-base focus:outline-none"
            dir="auto"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ms-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle-hover)] hover:text-[var(--text-primary)] transition"
          >
            ESC
          </button>
        </div>

        {/* Search Results Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)]">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-400" />
              <p className="font-semibold text-[var(--text-primary)]">{dict.noSearchResultsTitle}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{dict.noSearchResultsSubtitle}</p>
            </div>
          ) : (
            results.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  onSelectNote(note);
                  onClose();
                }}
                className="flex items-start justify-between p-3.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle-hover)] border border-[var(--border-color)] hover:border-blue-500/40 cursor-pointer transition group"
              >
                <div className="flex-1 pe-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: note.color || '#3B82F6' }}
                    />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {getCategoryName(note.categoryId)}
                    </span>
                  </div>

                  <h4
                    className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-blue-500 transition"
                    dir="auto"
                  >
                    {note.title || 'Untitled Note'}
                  </h4>

                  <p
                    className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-1"
                    dir="auto"
                  >
                    {note.plainTextContent.replace(note.title, '').trim()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {note.tags?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      <TagIcon className="w-2.5 h-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
