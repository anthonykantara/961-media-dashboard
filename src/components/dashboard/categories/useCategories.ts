import { useState } from 'react';
import { Category } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

export function useCategories(initialCategoriesList: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesList);

  const addCategory = (category: Omit<Category, 'id' | 'count'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      count: 0,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat));
  };

  const deleteCategory = (id: string, transferToId: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    const countToTransfer = categoryToDelete.count;

    setCategories(prev => prev
      .filter(c => c.id !== id)
      .map(c => c.id === transferToId ? { ...c, count: c.count + countToTransfer } : c)
    );
  };

  const dataTable = useDataTable<Category>({
    data: categories,
    searchFields: ['name', 'slug', 'description'],
  });

  return {
    searchQuery: dataTable.searchQuery,
    setSearchQuery: dataTable.setSearchQuery,
    filteredCategories: dataTable.filteredData,
    addCategory,
    updateCategory,
    deleteCategory,
    categories,
    sortField: dataTable.sortField,
    sortDirection: dataTable.sortDirection,
    handleSort: dataTable.handleSort,
    isLoading: dataTable.isLoading,
    setIsLoading: dataTable.setIsLoading,
  };
}
