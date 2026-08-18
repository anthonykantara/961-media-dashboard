import { useState } from 'react';
import { Page, SortField } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

export function usePages(initialPagesList: Page[]) {
  const [pages, setPages] = useState<Page[]>(initialPagesList);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const addPage = (newPageData: Omit<Page, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newPage: Page = {
      ...newPageData,
      id: `${Date.now()}`,
      date,
      time,
    };

    setPages(prev => [newPage, ...prev]);
  };

  const updatePage = (id: string, updatedFields: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const filterFn = (page: Page) => {
    return selectedLanguage === 'all' || (page.language || 'en') === selectedLanguage;
  };

  const customComparator = (a: Page, b: Page, sortField: string | keyof Page | null, sortDirection: 'asc' | 'desc') => {
    if (!sortField) return 0;
    if (sortField === 'date') {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  };

  const dataTable = useDataTable<Page>({
    data: pages,
    filterFn,
    customComparator,
  });

  return {
    pages,
    selectedLanguage,
    setSelectedLanguage,
    sortField: dataTable.sortField as SortField | null,
    setSortField: dataTable.setSortField,
    sortDirection: dataTable.sortDirection,
    setSortDirection: dataTable.setSortDirection,
    filteredPages: dataTable.filteredData,
    handleSort: dataTable.handleSort,
    addPage,
    updatePage,
    deletePage,
    isLoading: dataTable.isLoading,
    setIsLoading: dataTable.setIsLoading,
  };
}
