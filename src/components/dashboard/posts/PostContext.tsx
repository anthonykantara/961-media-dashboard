import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Post } from './types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const request = async (path: string, options: RequestInit = {}) => {
  const r = await fetch(`${API_BASE}${path}`, { ...options, credentials: 'include' });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.message || body.error || `Request failed (${r.status})`);
  return body;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'lb-en-1',
    title: "Lebanon's Tech Scene is Booming in 2026",
    status: 'Published',
    author: 'Anthony Rahayel',
    category: 'News',
    date: 'Mar 28, 2026',
    time: '10:30 AM',
    views: '14.2k',
    shares: '420',
    image: 'https://picsum.photos/seed/lb-tech/400/250',
    locationId: 'lb',
    language: 'en'
  },
  {
    id: 'lb-en-2',
    title: '10 Best Rooftop Bars in Beirut This Summer',
    status: 'Published',
    author: 'Sarah Khoury',
    category: 'Lifestyle',
    date: 'Mar 27, 2026',
    time: '02:15 PM',
    views: '18.9k',
    shares: '680',
    image: 'https://picsum.photos/seed/lb-rooftop/400/250',
    locationId: 'lb',
    language: 'en'
  },
  {
    id: 'lb-en-3',
    title: 'The Ultimate Guide to Lebanese Street Food',
    status: 'Published',
    author: 'Anthony Rahayel',
    category: 'Food & Drink',
    date: 'Mar 26, 2026',
    time: '11:00 AM',
    views: '22.4k',
    shares: '940',
    image: 'https://picsum.photos/seed/lb-food/400/250',
    locationId: 'lb',
    language: 'en'
  },
  {
    id: 'lb-en-4',
    title: 'Hidden Gems in the Mountains of Chouf',
    status: 'Published',
    author: 'Jane Smith',
    category: 'Travel',
    date: 'Mar 25, 2026',
    time: '04:45 PM',
    views: '9.1k',
    shares: '310',
    image: 'https://picsum.photos/seed/lb-chouf/400/250',
    locationId: 'lb',
    language: 'en'
  },
  {
    id: 'lb-en-5',
    title: 'Hiking Trails You Need to Explore in the Cedars',
    status: 'Published',
    author: 'John Doe',
    category: 'Things To Do',
    date: 'Mar 24, 2026',
    time: '09:15 AM',
    views: '11.8k',
    shares: '390',
    image: 'https://picsum.photos/seed/lb-cedars/400/250',
    locationId: 'lb',
    language: 'en'
  },
  {
    id: 'lb-en-6',
    title: 'Diaspora Shaping the Future of Lebanon',
    status: 'Published',
    author: 'Anthony Rahayel',
    category: 'Diaspora',
    date: 'Mar 23, 2026',
    time: '01:30 PM',
    views: '15.6k',
    shares: '520',
    image: 'https://picsum.photos/seed/lb-diaspora/400/250',
    locationId: 'lb',
    language: 'en'
  }
];

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'views' | 'shares' | 'date' | 'time'> & { date?: string; time?: string }) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  getPost: (id: string) => Post | undefined;
  loading: boolean;
  error: string | null;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    request('/api/articles')
      .then(data => {
        const rows = Array.isArray(data) ? data : data.articles || [];
        if (rows.length > 0) {
          setPosts(rows.map((item: any) => ({
            id: String(item.id),
            title: item.title || 'Untitled',
            status: item.status || 'draft',
            author: item.author || '',
            category: item.category || '',
            date: item.date || '',
            time: item.time || '',
            views: item.views ?? '0',
            shares: item.shares ?? '0',
            image: item.image || item.image_url || '',
            isEdited: Boolean(item.isEdited),
            editDate: item.editDate,
            editTime: item.editTime,
            locationId: item.locationId || item.location_id,
            language: item.language || 'en'
          })));
        } else {
          setPosts(INITIAL_POSTS);
        }
      })
      .catch(e => {
        setError(e.message);
        setPosts(INITIAL_POSTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const addPost = async (data: any) => {
    try {
      const created = await request('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const item = created.article || created;
      const post: any = { ...data, id: String(item.id), views: item.views ?? '0', shares: item.shares ?? '0', date: item.date || data.date || '', time: item.time || data.time || '' };
      setPosts(p => [post, ...p]);
      return post;
    } catch {
      const post: any = { ...data, id: String(Date.now()), views: '0', shares: '0', date: data.date || new Date().toLocaleDateString(), time: data.time || new Date().toLocaleTimeString() };
      setPosts(p => [post, ...p]);
      return post;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await request(`/api/articles/${id}`, { method: 'DELETE' });
    } catch {}
    setPosts(p => p.filter(x => x.id !== id));
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const updated = await request(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const item = updated.article || updated;
      setPosts(p => p.map(x => x.id === id ? { ...x, ...updates, ...item, id } : x));
    } catch {
      setPosts(p => p.map(x => x.id === id ? { ...x, ...updates } : x));
    }
  };

  const getPost = (id: string) => posts.find(p => p.id === id);

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost, getPost, loading, error }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const c = useContext(PostContext);
  if (!c) throw new Error('usePostContext must be used within PostProvider');
  return c;
}
