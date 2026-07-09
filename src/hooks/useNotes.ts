'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/types/note';
import { useAuth } from './useAuth';
import {
  getNotes,
  saveNote as firestoreSaveNote,
  permanentlyDeleteNote as firestoreDeleteNote,
  emptyAllTrash,
  subscribeToChanges
} from '@/lib/firestore';
import { searchService } from '@/lib/search';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    const uid = user?.uid || 'demo_user_001';
    try {
      const fetched = await getNotes(uid);
      setNotes(fetched);
      const activeNotes = fetched.filter((n) => !n.isTrashed);
      searchService.updateIndex(activeNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
    const unsubscribe = subscribeToChanges(() => {
      fetchNotes();
    });
    return () => unsubscribe();
  }, [fetchNotes]);

  const saveNote = async (note: Note) => {
    if (!note.title?.trim() && !note.plainTextContent?.trim()) {
      return;
    }
    const uid = user?.uid || 'demo_user_001';
    await firestoreSaveNote(uid, note);
  };

  const moveToTrash = async (note: Note) => {
    const trashedNote: Note = {
      ...note,
      isTrashed: true,
      trashedAt: Date.now(),
      updatedAt: Date.now()
    };
    await saveNote(trashedNote);
  };

  const restoreFromTrash = async (note: Note) => {
    const restoredNote: Note = {
      ...note,
      isTrashed: false,
      trashedAt: null,
      updatedAt: Date.now()
    };
    await saveNote(restoredNote);
  };

  const permanentlyDelete = async (noteId: string) => {
    const uid = user?.uid || 'demo_user_001';
    await firestoreDeleteNote(uid, noteId);
  };

  const purgeTrash = async () => {
    const uid = user?.uid || 'demo_user_001';
    await emptyAllTrash(uid);
  };

  const activeNotes = notes.filter((n) => !n.isTrashed);
  const trashedNotes = notes.filter((n) => n.isTrashed);

  return {
    notes: activeNotes,
    allNotes: notes,
    trashedNotes,
    loading,
    saveNote,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete,
    purgeTrash,
    refreshNotes: fetchNotes
  };
}
