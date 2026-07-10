'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { Note } from '@/types/note';
import { Category } from '@/types/category';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { TiptapToolbar } from './TiptapToolbar';
import {
  X,
  Pin,
  PinOff,
  Trash2,
  Download,
  Cloud,
  CheckCircle2,
  Tag as TagIcon,
  Palette
} from 'lucide-react';

interface NoteEditorModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  onTrash?: (note: Note) => void;
  categories: Category[];
}

const PRESET_NOTE_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onTrash,
  categories
}) => {
  const { dict, locale } = useLocale();
  const [sessionNoteId, setSessionNoteId] = useState<string>('');
  const [sessionCreatedAt, setSessionCreatedAt] = useState<number>(Date.now());
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [color, setColor] = useState(PRESET_NOTE_COLORS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Highlight,
      Placeholder.configure({
        placeholder: dict.noteBodyPlaceholder
      })
    ],
    content: note?.contentJSON || {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }]
    },
    onUpdate: () => {
      setSaveStatus('saving');
    }
  });

  useEffect(() => {
    if (note) {
      setSessionNoteId(note.id);
      setSessionCreatedAt(note.createdAt || Date.now());
      setTitle(note.title || '');
      setCategoryId(note.categoryId || null);
      setColor(note.color || PRESET_NOTE_COLORS[0]);
      setTags(note.tags || []);
      setIsPinned(Boolean(note.isPinned));
      if (editor && note.contentJSON) {
        editor.commands.setContent(note.contentJSON);
      }
    } else {
      setSessionNoteId(`note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
      setSessionCreatedAt(Date.now());
      setTitle('');
      setCategoryId(null);
      setColor(PRESET_NOTE_COLORS[0]);
      setTags([]);
      setIsPinned(false);
      if (editor) {
        editor.commands.setContent({
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }]
        });
      }
    }
  }, [note, isOpen, editor]);

  const handleSaveNote = useCallback(() => {
    if (!editor) return;
    const contentJSON = editor.getJSON();
    const plainTextContent = editor.getText().trim();
    const trimmedTitle = title.trim();

    // Prevent creating/saving blank untitled notes
    if (!trimmedTitle && !plainTextContent) {
      return;
    }

    let finalTitle = trimmedTitle;
    if (!finalTitle) {
      if (plainTextContent) {
        const firstLine = plainTextContent.split('\n')[0].trim();
        finalTitle = firstLine.length > 40 ? `${firstLine.slice(0, 40)}…` : firstLine;
      } else {
        finalTitle = 'Untitled Note';
      }
    }

    const finalNote: Note = {
      id: note?.id || sessionNoteId,
      categoryId,
      title: finalTitle,
      contentJSON,
      plainTextContent: `${finalTitle} ${plainTextContent}`,
      tags,
      color,
      isPinned,
      isTrashed: note?.isTrashed || false,
      trashedAt: note?.trashedAt || null,
      createdAt: note?.createdAt || sessionCreatedAt,
      updatedAt: Date.now()
    };
    onSave(finalNote);
    setSaveStatus('saved');
  }, [editor, title, note, categoryId, tags, color, isPinned, onSave, sessionNoteId, sessionCreatedAt]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (saveStatus === 'saving') {
        handleSaveNote();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [saveStatus, handleSaveNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
      setSaveStatus('saving');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
    setSaveStatus('saving');
  };

  const handleExport = (format: 'md' | 'json' | 'txt') => {
    if (!editor) return;
    let content = '';
    const ext = format;
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(editor.getJSON(), null, 2);
      mime = 'application/json';
    } else if (format === 'md') {
      content = `# ${title}\n\n${editor.getText()}`;
    } else {
      content = `${title}\n\n${editor.getText()}`;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'note').replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md sm:p-6 animate-fadeIn">
      <div className="studio-surface w-full h-full sm:h-[90vh] sm:max-w-4xl flex flex-col rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-[var(--border-color)]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              {saveStatus === 'saved' ? (
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dict.saved}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  {dict.saving}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPinned(!isPinned);
                setSaveStatus('saving');
              }}
              className={`p-2 rounded-xl transition ${
                isPinned
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
              }`}
              title={isPinned ? dict.unpinNote : dict.pinNote}
            >
              {isPinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
            </button>

            {/* Export dropdown menu */}
            <div className="relative group">
              <button
                type="button"
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition flex items-center gap-1"
                title={dict.exportNote}
              >
                <Download className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block w-48 py-2 studio-surface rounded-xl shadow-xl z-20 border border-[var(--border-color)] text-sm">
                <button
                  type="button"
                  onClick={() => handleExport('md')}
                  className="w-full text-left px-4 py-2 hover:bg-[var(--bg-subtle)] transition text-[var(--text-primary)]"
                >
                  {dict.exportMarkdown}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-4 py-2 hover:bg-[var(--bg-subtle)] transition text-[var(--text-primary)]"
                >
                  {dict.exportJson}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('txt')}
                  className="w-full text-left px-4 py-2 hover:bg-[var(--bg-subtle)] transition text-[var(--text-primary)]"
                >
                  {dict.exportText}
                </button>
              </div>
            </div>

            {note && onTrash && (
              <button
                type="button"
                onClick={() => {
                  onTrash(note);
                  onClose();
                }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-500/20 transition"
                title={dict.moveToTrash}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleSaveNote();
                onClose();
              }}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Category:</span>
            <select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value || null);
                setSaveStatus('saving');
              }}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
            >
              <option value="" className="bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                {dict.uncategorized}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Accent:
            </span>
            <div className="flex items-center gap-1.5">
              {PRESET_NOTE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setSaveStatus('saving');
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full transition transform ${
                    color === c ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title Input */}
        <div className="px-6 pt-5 pb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('saving');
            }}
            placeholder={dict.noteTitlePlaceholder}
            className="w-full bg-transparent text-2xl sm:text-3xl font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-heading"
            dir="auto"
          />
        </div>

        {/* Tags input */}
        <div className="px-6 pb-3 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-500 border border-blue-500/30"
            >
              <TagIcon className="w-3 h-3" />
              {t}
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-[var(--text-primary)] transition"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={dict.tagsPlaceholder}
            className="bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none min-w-[130px]"
          />
        </div>

        {/* Tiptap Toolbar */}
        <div className="px-6">
          <TiptapToolbar editor={editor} />
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-[var(--bg-surface)]">
          <EditorContent editor={editor} className="prose max-w-none text-[var(--text-primary)]" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">
            {locale === 'ur'
              ? 'اردو نستعلیق ٹائپوگرافی فعال ہے'
              : 'Auto-saving enabled • Multi-tab offline storage'}
          </span>
          <button
            type="button"
            onClick={() => {
              handleSaveNote();
              onClose();
            }}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition"
          >
            {dict.saved} / Done
          </button>
        </div>
      </div>
    </div>
  );
};
