import { Note } from '@/types/note';

class SearchService {
  private notes: Note[] = [];

  public init(notes: Note[]): void {
    this.notes = notes;
  }

  public updateIndex(notes: Note[]): void {
    this.notes = notes;
  }

  public search(query: string): Note[] {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return this.notes;
    }
    return this.notes.filter((note) => {
      const titleMatch = note.title?.toLowerCase().includes(cleanQuery);
      const contentMatch = note.plainTextContent?.toLowerCase().includes(cleanQuery);
      const tagsMatch = note.tags?.some((tag) => tag.toLowerCase().includes(cleanQuery));
      return titleMatch || contentMatch || tagsMatch;
    });
  }
}

export const searchService = new SearchService();
