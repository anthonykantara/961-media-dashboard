import { useState } from 'react';
import { Post, SortField } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

export function usePosts(posts: Post[]) {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterAuthors, setFilterAuthors] = useState<string[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const postsPerPage = 20;

  const categories: string[] = Array.from(new Set<string>(posts.map(p => p.category)));
  const authors: string[] = Array.from(new Set<string>(posts.flatMap(p => Array.isArray(p.author) ? p.author : [p.author])));
  const years: string[] = Array.from(new Set<string>(posts.map(p => p.date.split(', ')[1]))).sort().reverse();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filterFn = (post: Post) => {
    const postAuthors = Array.isArray(post.author) ? post.author : [post.author];
    const matchesStatus = filterStatus === 'All' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    const matchesAuthor = filterAuthors.length === 0 || postAuthors.some(a => filterAuthors.includes(a));
    const matchesMonth = filterMonth === 'All' || post.date.startsWith(filterMonth);
    const matchesYear = filterYear === 'All' || post.date.endsWith(filterYear);
    return matchesStatus && matchesCategory && matchesAuthor && matchesMonth && matchesYear;
  };

  const customComparator = (a: Post, b: Post, sortField: string | keyof Post | null, sortDirection: 'asc' | 'desc') => {
    if (!sortField) return 0;

    let valA: any = a[sortField as keyof Post];
    let valB: any = b[sortField as keyof Post];

    if (sortField === 'date') {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortField === 'views') {
      const parseViews = (v: string) => {
        if (typeof v === 'string' && v.endsWith('k')) return parseFloat(v) * 1000;
        return parseFloat(v) || 0;
      };
      valA = parseViews(a.views);
      valB = parseViews(b.views);
    } else if (sortField === 'shares') {
      valA = parseInt(a.shares) || 0;
      valB = parseInt(b.shares) || 0;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  };

  const dataTable = useDataTable<Post>({
    data: posts,
    searchFields: ['title', (p) => (Array.isArray(p.author) ? p.author.join(' ') : p.author)],
    filterFn,
    customComparator,
    pageSize: postsPerPage,
  });

  const toggleAuthor = (author: string) => {
    setFilterAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author) 
        : [...prev, author]
    );
  };

  const clearAllFilters = () => {
    setFilterStatus('All');
    setFilterCategory('All');
    setFilterAuthors([]);
    setFilterMonth('All');
    setFilterYear('All');
    dataTable.setSearchQuery('');
  };

  return {
    searchQuery: dataTable.searchQuery,
    setSearchQuery: dataTable.setSearchQuery,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filterAuthors, setFilterAuthors,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    currentPage: dataTable.currentPage,
    setCurrentPage: dataTable.setCurrentPage,
    sortField: dataTable.sortField as SortField | null,
    setSortField: dataTable.setSortField,
    sortDirection: dataTable.sortDirection,
    setSortDirection: dataTable.setSortDirection,
    categories, authors, years, months,
    filteredPosts: dataTable.filteredData,
    paginatedPosts: dataTable.paginatedData,
    totalPages: dataTable.totalPages,
    handleSort: dataTable.handleSort,
    toggleAuthor, clearAllFilters,
    postsPerPage,
    isLoading: dataTable.isLoading,
    setIsLoading: dataTable.setIsLoading,
  };
}
