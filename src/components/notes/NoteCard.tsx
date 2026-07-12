'use client';

import React from 'react';
import { Note } from '@/types/note';
import { Category } from '@/types/category';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Pin, Trash2, RotateCcw, Tag as TagIcon, Calendar } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  category?: Category;
  onClick: () => void;
  onTogglePin?: (note: Note) => void;
  onTrash?: (note: Note) => void;
  onRestore?: (note: Note) => void;
  onPermanentDelete?: (note: Note) => void;
  isTrashView?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  category,
  onClick,
  onTogglePin,
  onTrash,
  onRestore,
  onPermanentDelete,
  isTrashView = false
}) => {
  const { dict } = useLocale();

  const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      onClick={onClick}
      className="studio-card relative rounded-2xl overflow-hidden cursor-pointer flex flex-col group border border-[var(--border-color)] hover:border-blue-500 transition-all duration-300"
    >
      {/* Accent Color Header Bar */}
      <div
        className="h-2 w-full transition-all duration-300 group-hover:h-2.5"
        style={{ backgroundColor: note.color || '#3B82F6' }}
      />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Category badge & Pin button */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {category ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border-color)] bg-[var(--bg-subtle)]"
                style={{ color: category.color }}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-subtle)]">
                {dict.uncategorized}
              </span>
            )}

            {!isTrashView && onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note);
                }}
                className={`p-1.5 rounded-lg transition ${
                  note.isPinned
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-[var(--text-muted)] opacity-60 group-hover:opacity-100 hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
                title={note.isPinned ? dict.unpinNote : dict.pinNote}
              >
                <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 leading-snug group-hover:text-blue-500 transition font-heading"
            dir="auto"
          >
            {note.title || 'Untitled Note'}
          </h3>

          {/* Body Snippet */}
          <p
            className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-4 leading-relaxed"
            dir="auto"
          >
            {note.plainTextContent.replace(note.title, '').trim() || 'No preview text...'}
          </p>
        </div>

        {/* Footer: Tags, Date & Trash actions */}
        <div>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {note.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                >
                  <TagIcon className="w-2.5 h-2.5 text-blue-500" />
                  {t}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-[10px] text-[var(--text-muted)] self-center">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>

            {isTrashView ? (
              <div className="flex items-center gap-2">
                {onRestore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(note);
                    }}
                    className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/20 transition flex items-center gap-1 text-xs"
                    title={dict.restoreNote}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                {onPermanentDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPermanentDelete(note);
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition"
                    title={dict.deletePermanently}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              onTrash && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrash(note);
                  }}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] opacity-60 group-hover:opacity-100 hover:text-red-500 hover:bg-[var(--bg-subtle)] transition"
                  title={dict.moveToTrash}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
