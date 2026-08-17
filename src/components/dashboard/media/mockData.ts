import { MediaItem } from './types';

export const initialMedia: MediaItem[] = [
  {
    id: 'f1',
    name: 'Articles',
    type: 'folder',
    parentId: null,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'f2',
    name: 'Pages',
    type: 'folder',
    parentId: null,
    createdAt: '2026-01-16T11:00:00Z',
  },
  {
    id: 'f3',
    name: 'Assets',
    type: 'folder',
    parentId: null,
    createdAt: '2026-01-17T12:00:00Z',
  },
  {
    id: 'f1-1',
    name: 'Tech News',
    type: 'folder',
    parentId: 'f1',
    createdAt: '2026-01-18T13:00:00Z',
  },
  {
    id: 'img1',
    name: 'tech-gadget.jpg',
    type: 'image',
    size: 1024 * 500, // 500 KB
    url: 'https://picsum.photos/seed/tech/800/600',
    parentId: 'f1-1',
    createdAt: '2026-01-19T14:00:00Z',
    linkedTo: [
      { id: 'p1', type: 'post', title: 'The Future of Gadgets' },
      { id: 'p2', type: 'post', title: 'Top 10 Tech Trends' }
    ]
  },
  {
    id: 'img2',
    name: 'office-space.jpg',
    type: 'image',
    size: 1024 * 800, // 800 KB
    url: 'https://picsum.photos/seed/office/800/600',
    parentId: 'f2',
    createdAt: '2026-01-20T15:00:00Z',
    linkedTo: [
      { id: 'pg1', type: 'page', title: 'About Us' }
    ]
  },
  {
    id: 'img3',
    name: 'unlinked-photo.jpg',
    type: 'image',
    size: 1024 * 300, // 300 KB
    url: 'https://picsum.photos/seed/nature/800/600',
    parentId: 'f3',
    createdAt: '2026-01-21T16:00:00Z',
    linkedTo: []
  },
  {
    id: 'vid1',
    name: 'intro-video.mp4',
    type: 'video',
    size: 1024 * 1024 * 15, // 15 MB
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    parentId: 'f2',
    createdAt: '2026-01-22T17:00:00Z',
    linkedTo: [
      { id: 'pg2', type: 'page', title: 'Services' }
    ]
  },
  {
    id: 'doc1',
    name: 'report-2025.pdf',
    type: 'document',
    size: 1024 * 1024 * 2, // 2 MB
    url: '#',
    parentId: 'f3',
    createdAt: '2026-01-23T18:00:00Z',
    linkedTo: []
  },
  {
    id: 'img4',
    name: 'hero-banner.jpg',
    type: 'image',
    size: 1024 * 1200, // 1.2 MB
    url: 'https://picsum.photos/seed/banner/1920/1080',
    parentId: null,
    createdAt: '2026-01-24T19:00:00Z',
    linkedTo: [
      { id: 'pg3', type: 'page', title: 'Home' }
    ]
  }
];
