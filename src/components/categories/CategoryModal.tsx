'use client';

import React, { useState } from 'react';
import { Category } from '@/types/category';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { X, Check } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Category) => void;
  existingCategory?: Category | null;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

const PRESET_EMOJIS = [
  '📚', '📜', '💻', '💡', '🎨', '🔬', '📝', '🧠',
  '🗂️', '🎯', '🚀', '🌟', '💼', '📌', '📖', '🕌'
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCategory
}) => {
  const { dict } = useLocale();
  const [name, setName] = useState(existingCategory?.name || '');
  const [color, setColor] = useState(existingCategory?.color || PRESET_COLORS[0]);
  const [emoji, setEmoji] = useState(existingCategory?.emoji || PRESET_EMOJIS[0]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cat: Category = {
      id: existingCategory?.id || `cat_${Date.now()}`,
      name: name.trim(),
      color,
      emoji,
      order: existingCategory?.order || Date.now(),
      createdAt: existingCategory?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    onSave(cat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border-color)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {existingCategory ? dict.newCategory : dict.newCategory}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {dict.categoryNamePlaceholder}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dict.categoryNamePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {dict.pickEmoji}
            </label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`py-2 rounded-xl text-xl flex items-center justify-center transition border ${
                    emoji === e
                      ? 'bg-blue-500/20 border-blue-500 text-[var(--text-primary)] scale-110 shadow-lg'
                      : 'bg-[var(--bg-subtle)] border-transparent hover:bg-[var(--bg-subtle-hover)]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {dict.pickColor}
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition transform ${
                    color === c ? 'ring-2 ring-[var(--text-primary)] scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition"
            >
              {dict.saveCategory}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
