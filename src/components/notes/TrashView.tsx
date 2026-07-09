'use client';

import React, { useState } from 'react';
import { Note } from '@/types/note';
import { Category } from '@/types/category';
import { NoteCard } from './NoteCard';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Trash2 } from 'lucide-react';

interface TrashViewProps {
  trashedNotes: Note[];
  categories: Category[];
  onRestore: (note: Note) => void;
  onPermanentDelete: (note: Note) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  trashedNotes,
  categories,
  onRestore,
  onPermanentDelete,
  onEmptyTrash
}) => {
  const { dict } = useLocale();
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span>{dict.trashTitle}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">{dict.trashSubtitle}</p>
        </div>

        {trashedNotes.length > 0 && (
          <div className="flex items-center gap-3">
            {confirmEmpty ? (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 p-2 rounded-xl">
                <span className="text-xs text-red-300 font-semibold">
                  Confirm Delete All?
                </span>
                <button
                  onClick={() => {
                    onEmptyTrash();
                    setConfirmEmpty(false);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-500"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmEmpty(false)}
                  className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmEmpty(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{dict.emptyTrash}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trashed Notes Grid */}
      {trashedNotes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <Trash2 className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-20" />
          <h3 className="text-lg font-bold text-white">{dict.emptyTrashTitle}</h3>
          <p className="text-xs text-gray-400 mt-1">{dict.emptyTrashSubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trashedNotes.map((note) => {
            const cat = categories.find((c) => c.id === note.categoryId);
            return (
              <NoteCard
                key={note.id}
                note={note}
                category={cat}
                onClick={() => {}}
                onRestore={onRestore}
                onPermanentDelete={onPermanentDelete}
                isTrashView={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
