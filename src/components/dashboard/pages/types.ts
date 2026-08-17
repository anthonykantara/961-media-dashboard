export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'Published' | 'Draft';
  author: string;
  date: string;
  time: string;
  language?: string;
  locationId?: string;
}

export type SortField = 'date' | 'title';
export type SortDirection = 'asc' | 'desc';
