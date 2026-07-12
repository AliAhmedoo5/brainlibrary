import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { Category } from '@/types/category';
import { Note } from '@/types/note';

const LOCAL_CATEGORIES_KEY = 'brain_categories_cache';
const LOCAL_NOTES_KEY = 'brain_notes_cache';

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_literature',
    name: 'Literature & Urdu (ادب و شعر)',
    color: '#8B5CF6',
    emoji: '📜',
    order: 1,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'cat_cs',
    name: 'Computer Science & AI',
    color: '#3B82F6',
    emoji: '💻',
    order: 2,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4
  },
  {
    id: 'cat_ideas',
    name: 'Project Ideas (افکار)',
    color: '#10B981',
    emoji: '💡',
    order: 3,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3
  }
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note_001',
    categoryId: 'cat_literature',
    title: 'اقبال کا فلسفہ خودی — Allama Iqbal’s Philosophy of Khudi',
    contentJSON: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'خودی کا سرِ نہاں لا الہ الا اللہ' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'خودی (Khudi) Allama Iqbal کے کلام کا مرکزی محور ہے۔ اس سے مراد خود شناسی، خود اعتمادی اور انسانی روح کی بلندی ہے۔ جب انسان اپنی اصل صلاحیت کو پہچان لیتا ہے تو وہ تقدیر کا شاکر نہیں بلکہ خالق بن جاتا ہے۔'
            }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'خدا بندے سے خود پوچھے، بتا تیری رضا کیا ہے' }]
                }
              ]
            }
          ]
        }
      ]
    },
    plainTextContent:
      'اقبال کا فلسفہ خودی Allama Iqbal’s Philosophy of Khudi خودی کا سرِ نہاں لا الہ الا اللہ خودی (Khudi) Allama Iqbal کے کلام کا مرکزی محور ہے۔ اس سے مراد خود شناسی، خود اعتمادی اور انسانی روح کی بلندی ہے۔ خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے',
    tags: ['Urdu Poetry', 'Philosophy', 'اقبال'],
    color: '#8B5CF6',
    isPinned: true,
    isTrashed: false,
    trashedAt: null,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: 'note_002',
    categoryId: 'cat_cs',
    title: 'Offline-First Web Architecture & Fuse.js Indexing',
    contentJSON: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Why Client-Side Search Shines' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'By keeping a client-side Fuse.js singleton synchronized with local state, we achieve sub-50 millisecond search responses across both English keywords and Nastaliq Urdu script without making network requests.'
            }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Zero latency fuzzy matching' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Works seamlessly in airplane mode' }]
                }
              ]
            }
          ]
        }
      ]
    },
    plainTextContent:
      'Offline-First Web Architecture & Fuse.js Indexing Why Client-Side Search Shines By keeping a client-side Fuse.js singleton synchronized with local state we achieve sub-50 millisecond search responses across both English keywords and Nastaliq Urdu script Zero latency fuzzy matching Works seamlessly in airplane mode',
    tags: ['Architecture', 'Next.js', 'Fuse.js'],
    color: '#3B82F6',
    isPinned: true,
    isTrashed: false,
    trashedAt: null,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'note_003',
    categoryId: 'cat_ideas',
    title: 'Bilingual Knowledge Management Roadmap',
    contentJSON: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Plan for seamless direction flipping (RTL <-> LTR) and instant theme toggling for researchers working across Latin and Arabic scripts.'
            }
          ]
        }
      ]
    },
    plainTextContent:
      'Bilingual Knowledge Management Roadmap Plan for seamless direction flipping RTL LTR and instant theme toggling for researchers working across Latin and Arabic scripts.',
    tags: ['Roadmap', 'Bilingual'],
    color: '#10B981',
    isPinned: false,
    isTrashed: false,
    trashedAt: null,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000
  }
];

// Event listeners for local updates across components
type Listener = () => void;
const changeListeners = new Set<Listener>();

export function notifyChange() {
  changeListeners.forEach((fn) => fn());
}

export function subscribeToChanges(fn: Listener): () => void {
  changeListeners.add(fn);
  return () => {
    changeListeners.delete(fn);
  };
}

function getCategoriesKey(uid: string): string {
  if (uid === 'demo_user_001') return LOCAL_CATEGORIES_KEY;
  return `${LOCAL_CATEGORIES_KEY}_${uid}`;
}

function getNotesKey(uid: string): string {
  if (uid === 'demo_user_001') return LOCAL_NOTES_KEY;
  return `${LOCAL_NOTES_KEY}_${uid}`;
}

// Ensure seeded data exists locally for demo mode
function ensureSeedData() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LOCAL_CATEGORIES_KEY)) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(LOCAL_NOTES_KEY)) {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(INITIAL_NOTES));
  }
}

// Auto-purge notes trashed older than 30 days
export function purgeOldTrash(uid: string = 'demo_user_001'): void {
  if (typeof window === 'undefined') return;
  ensureSeedData();
  const key = getNotesKey(uid);
  const notesRaw = localStorage.getItem(key);
  if (!notesRaw) return;
  const notes: Note[] = JSON.parse(notesRaw);
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const filtered = notes.filter((n) => {
    if (n.isTrashed && n.trashedAt && now - n.trashedAt > thirtyDaysMs) {
      return false; // Purge
    }
    return true;
  });
  localStorage.setItem(key, JSON.stringify(filtered));
}

// Categories CRUD
export async function getCategories(uid: string): Promise<Category[]> {
  if (uid === 'demo_user_001') {
    ensureSeedData();
    const rawDemo = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_CATEGORIES_KEY) : null;
    return rawDemo ? JSON.parse(rawDemo) : INITIAL_CATEGORIES;
  }

  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, `users/${uid}/categories`);
      const q = query(colRef, orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const list: Category[] = [];
      snap.forEach((d) => list.push(d.data() as Category));
      if (typeof window !== 'undefined') {
        localStorage.setItem(getCategoriesKey(uid), JSON.stringify(list));
      }
      return list;
    } catch (err) {
      console.warn('Firestore read error, checking user local cache:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(getCategoriesKey(uid));
    if (raw) return JSON.parse(raw);
  }
  return [];
}

export async function saveCategory(uid: string, category: Category): Promise<void> {
  if (typeof window !== 'undefined') {
    const key = getCategoriesKey(uid);
    const raw = localStorage.getItem(key);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(key, JSON.stringify(list));
  }
  notifyChange();

  if (db && isFirebaseConfigured && uid !== 'demo_user_001') {
    try {
      await setDoc(doc(db, `users/${uid}/categories`, category.id), category);
    } catch (err) {
      console.warn('Firestore save category error (cached locally):', err);
    }
  }
}

export async function deleteCategory(uid: string, categoryId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const key = getCategoriesKey(uid);
    const raw = localStorage.getItem(key);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((c) => c.id !== categoryId);
    localStorage.setItem(key, JSON.stringify(filtered));
  }
  notifyChange();

  if (db && isFirebaseConfigured && uid !== 'demo_user_001') {
    try {
      await deleteDoc(doc(db, `users/${uid}/categories`, categoryId));
    } catch (err) {
      console.warn('Firestore delete category error:', err);
    }
  }
}

// Notes CRUD
export async function getNotes(uid: string): Promise<Note[]> {
  purgeOldTrash(uid);

  if (uid === 'demo_user_001') {
    ensureSeedData();
    const rawDemo = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_NOTES_KEY) : null;
    const list: Note[] = rawDemo ? JSON.parse(rawDemo) : INITIAL_NOTES;
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, `users/${uid}/notes`);
      const snap = await getDocs(colRef);
      const list: Note[] = [];
      snap.forEach((d) => list.push(d.data() as Note));
      const sorted = list.sort((a, b) => b.updatedAt - a.updatedAt);
      if (typeof window !== 'undefined') {
        localStorage.setItem(getNotesKey(uid), JSON.stringify(sorted));
      }
      return sorted;
    } catch (err) {
      console.warn('Firestore read notes error, checking user local cache:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(getNotesKey(uid));
    if (raw) {
      const list: Note[] = JSON.parse(raw);
      return list.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }
  return [];
}

export async function saveNote(uid: string, note: Note): Promise<void> {
  if (typeof window !== 'undefined') {
    const key = getNotesKey(uid);
    const raw = localStorage.getItem(key);
    const list: Note[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      list[idx] = note;
    } else {
      list.unshift(note);
    }
    localStorage.setItem(key, JSON.stringify(list));
  }
  notifyChange();

  if (db && isFirebaseConfigured && uid !== 'demo_user_001') {
    try {
      await setDoc(doc(db, `users/${uid}/notes`, note.id), note);
    } catch (err) {
      console.warn('Firestore save note error (cached locally):', err);
    }
  }
}

export async function permanentlyDeleteNote(uid: string, noteId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const key = getNotesKey(uid);
    const raw = localStorage.getItem(key);
    const list: Note[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((n) => n.id !== noteId);
    localStorage.setItem(key, JSON.stringify(filtered));
  }
  notifyChange();

  if (db && isFirebaseConfigured && uid !== 'demo_user_001') {
    try {
      await deleteDoc(doc(db, `users/${uid}/notes`, noteId));
    } catch (err) {
      console.warn('Firestore delete note error:', err);
    }
  }
}

export async function emptyAllTrash(uid: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const key = getNotesKey(uid);
    const raw = localStorage.getItem(key);
    const list: Note[] = raw ? JSON.parse(raw) : [];
    const activeOnly = list.filter((n) => !n.isTrashed);
    localStorage.setItem(key, JSON.stringify(activeOnly));
  }
  notifyChange();

  if (db && isFirebaseConfigured && uid !== 'demo_user_001') {
    if (typeof window !== 'undefined') {
      const key = getNotesKey(uid);
      const raw = localStorage.getItem(key);
      const list: Note[] = raw ? JSON.parse(raw) : [];
      const trashed = list.filter((n) => n.isTrashed);
      for (const note of trashed) {
        try {
          await deleteDoc(doc(db, `users/${uid}/notes`, note.id));
        } catch (err) {
          console.warn('Firestore empty trash error:', err);
        }
      }
    }
  }
}
