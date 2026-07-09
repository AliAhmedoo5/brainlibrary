export interface Category {
  id: string;
  name: string;
  color: string;       // Hex e.g. '#3B82F6'
  emoji: string;       // Unicode emoji e.g. '📚'
  order: number;
  createdAt: number;
  updatedAt: number;
}
