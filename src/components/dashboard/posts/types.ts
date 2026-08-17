export interface Post {
  id: string;
  title: string;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Review';
  author: string | string[];
  category: string;
  date: string;
  time: string;
  views: string;
  shares: string;
  image: string;
  isEdited?: boolean;
  editDate?: string;
  editTime?: string;
  locationId?: string;
  language?: string;
}

export type SortField = 'date' | 'views' | 'shares';
export type SortDirection = 'asc' | 'desc';
