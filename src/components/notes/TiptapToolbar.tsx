'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Highlighter,
  Undo,
  Redo,
  Strikethrough
} from 'lucide-react';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition text-sm flex items-center justify-center ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 bg-white/5 border-b border-white/10 rounded-t-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(editor.isActive('highlight'))}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};
