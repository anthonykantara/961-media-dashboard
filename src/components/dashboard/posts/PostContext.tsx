import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Post } from './types';
import { initialPosts } from './mockData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'views' | 'shares' | 'date' | 'time'> & { date?: string; time?: string }) => Post;
  deletePost: (id: string) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  getPost: (id: string) => Post | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/articles`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const normalized: Post[] = data.map((item: any) => ({
              id: String(item.id || item._id || Math.random().toString(36).substr(2, 9)),
              title: item.title || 'Untitled',
              status: item.status || 'Published',
              author: item.author || 'Editorial',
              category: item.category || item.section || 'News',
              date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: item.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              views: item.views !== undefined ? String(item.views) : '0.0k',
              shares: item.shares !== undefined ? String(item.shares) : '0',
              image: item.image || 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80',
              isEdited: Boolean(item.isEdited),
              editDate: item.editDate,
              editTime: item.editTime,
              locationId: item.locationId,
              language: item.language || 'en'
            }));
            setPosts(normalized);
          }
        }
      } catch (error) {
        console.error('Error fetching articles from backend:', error);
      }
    };
    fetchPosts();
  }, []);

  const addPost = (newPostData: Omit<Post, 'id' | 'views' | 'shares' | 'date' | 'time'> & { date?: string; time?: string }) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const post: Post = {
      ...newPostData,
      id: Math.random().toString(36).substr(2, 9),
      views: '0.0k',
      shares: '0',
      date: newPostData.date || dateStr,
      time: newPostData.time || timeStr,
    };

    setPosts(prev => [post, ...prev]);

    fetch(`${API_BASE}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (data && (data.id || data._id)) {
            const serverId = String(data.id || data._id);
            if (serverId !== post.id) {
              setPosts(prev => prev.map(p => p.id === post.id ? { ...p, id: serverId } : p));
            }
          }
        }
      })
      .catch(error => {
        console.error('Error adding post to backend:', error);
      });

    return post;
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));

    fetch(`${API_BASE}/api/articles/${id}`, {
      method: 'DELETE',
    }).catch(error => {
      console.error('Error deleting post on backend:', error);
    });
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          isEdited: true,
          editDate: dateStr,
          editTime: timeStr
        };
      }
      return p;
    }));

    fetch(`${API_BASE}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }).catch(error => {
      console.error('Error updating post on backend:', error);
    });
  };

  const getPost = (id: string) => {
    return posts.find(p => p.id === id);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost, getPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}
