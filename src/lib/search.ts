import Fuse from 'fuse.js';
import { Note } from '@/types/note';

class SearchService {
  private fuse: Fuse<Note> | null = null;
  private notes: Note[] = [];

  constructor() {
    this.init([]);
  }

  public init(notes: Note[]): void {
    this.notes = notes;
    this.fuse = new Fuse(this.notes, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'plainTextContent', weight: 0.4 },
        { name: 'tags', weight: 0.2 }
      ],
      threshold: 0.35,
      includeScore: true,
      ignoreLocation: true,
      useExtendedSearch: false
    });
  }

  public updateIndex(notes: Note[]): void {
    this.notes = notes;
    if (this.fuse) {
      this.fuse.setCollection(this.notes);
    } else {
      this.init(this.notes);
    }
  }

  public search(query: string): Note[] {
    if (!query || query.trim() === '') {
      return this.notes;
    }
    if (!this.fuse) {
      return this.notes;
    }
    const results = this.fuse.search(query.trim());
    return results.map((r) => r.item);
  }
}

export const searchService = new SearchService();
