'use client';

import React from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { TrashView } from '@/components/notes/TrashView';

export default function TrashPage() {
  const { trashedNotes, restoreFromTrash, permanentlyDelete, purgeTrash } = useNotes();
  const { categories } = useCategories();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TrashView
        trashedNotes={trashedNotes}
        categories={categories}
        onRestore={restoreFromTrash}
        onPermanentDelete={(note) => permanentlyDelete(note.id)}
        onEmptyTrash={purgeTrash}
      />
    </div>
  );
}
