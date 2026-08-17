import { useState, useMemo } from 'react';
import { Page, SortField, SortDirection } from './types';

export function usePages(initialPagesList: Page[]) {
  const [pages, setPages] = useState<Page[]>(initialPagesList);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesLang = selectedLanguage === 'all' || (page.language || 'en') === selectedLanguage;
      return matchesLang;
    });
  }, [pages, selectedLanguage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPages = useMemo(() => {
    const sorted = [...filteredPages].sort((a, b) => {
      if (!sortField) return 0;
      
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPages, sortField, sortDirection]);

  return {
    pages,
    selectedLanguage,
    setSelectedLanguage,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filteredPages: sortedPages,
    handleSort,
    addPage,
    updatePage,
    deletePage
  };
}

