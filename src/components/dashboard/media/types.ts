export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'folder';

export interface LinkedItem {
  id: string;
  type: 'post' | 'page';
  title: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  size?: number; // in bytes
  url?: string;
  altText?: string;
  caption?: string;
  dimensions?: string;
  folderColor?: string;
  parentId: string | null;
  createdAt: string;
  linkedTo?: LinkedItem[];
}

export interface Folder extends MediaItem {
  type: 'folder';
}

export interface File extends MediaItem {
  type: Exclude<MediaType, 'folder'>;
}

export type SortOption = 'newest' | 'oldest' | 'size-desc' | 'size-asc' | 'name-asc';
