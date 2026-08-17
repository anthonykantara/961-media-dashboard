import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post } from './types';
import { initialPosts } from './mockData';

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
    return post;
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
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
