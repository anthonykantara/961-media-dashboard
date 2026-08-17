import { useState, useMemo } from 'react';
import { Category } from './types';

export function useCategories(initialCategories: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const addCategory = (category: Omit<Category, 'id' | 'count'>) => {
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      ...category,
      count: 0
    };
    setCategories(prev => [newCat, ...prev]);
  };

  const deleteCategory = (id: string, transferToId: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    setCategories(prev => prev
      .filter(cat => cat.id !== id)
      .map(cat => {
        if (cat.id === transferToId) {
          return { ...cat, count: cat.count + categoryToDelete.count };
        }
        return cat;
      })
    );
  };

  const updateCategory = (id: string, updatedFields: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat));
  };

  return {
    categories,
    searchQuery, setSearchQuery,
    filteredCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
