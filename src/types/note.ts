export interface Note {
  id: string;
  categoryId: string | null;
  title: string;
  contentJSON: Record<string, unknown>; // Tiptap JSON document tree
  plainTextContent: string;         // Extracted string for Fuse.js indexing
  tags: string[];
  color: string;                    // Card accent color e.g. '#3B82F6'
  isPinned: boolean;
  isTrashed: boolean;
  trashedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  locale: 'en' | 'ur';
  theme: 'dark' | 'light';
  photoURL?: string;
}
