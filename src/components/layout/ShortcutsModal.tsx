'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { dict } = useLocale();

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], label: dict.shortcutSearch },
    { keys: ['Ctrl', 'N'], label: dict.shortcutNewNote },
    { keys: ['Ctrl', 'B'], label: dict.shortcutToggleSidebar },
    { keys: ['ESC'], label: 'Close active modal / dialog' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <span>{dict.shortcutsModalTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <span className="text-sm text-gray-300">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono text-white"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
