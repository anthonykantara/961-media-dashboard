import { useState, useMemo } from 'react';
import { Post, SortField, SortDirection } from './types';

export function usePosts(posts: Post[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterAuthors, setFilterAuthors] = useState<string[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const postsPerPage = 20;

  const categories: string[] = Array.from(new Set<string>(posts.map(p => p.category)));
  const authors: string[] = Array.from(new Set<string>(posts.flatMap(p => Array.isArray(p.author) ? p.author : [p.author])));
  const years: string[] = Array.from(new Set<string>(posts.map(p => p.date.split(', ')[1]))).sort().reverse();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postAuthors = Array.isArray(post.author) ? post.author : [post.author];
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           postAuthors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'All' || post.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
      const matchesAuthor = filterAuthors.length === 0 || postAuthors.some(a => filterAuthors.includes(a));
      const matchesMonth = filterMonth === 'All' || post.date.startsWith(filterMonth);
      const matchesYear = filterYear === 'All' || post.date.endsWith(filterYear);
      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor && matchesMonth && matchesYear;
    });
  }, [posts, searchQuery, filterStatus, filterCategory, filterAuthors, filterMonth, filterYear]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts].sort((a, b) => {
      if (!sortField) return 0;
      
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }

      if (sortField === 'views') {
        const parseViews = (v: string) => {
          if (v.endsWith('k')) return parseFloat(v) * 1000;
          return parseFloat(v);
        };
        valA = parseViews(a.views);
        valB = parseViews(b.views);
      } else if (sortField === 'shares') {
        valA = parseInt(a.shares);
        valB = parseInt(b.shares);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPosts, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    return sortedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  }, [sortedPosts, currentPage, postsPerPage]);

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
    setSearchQuery('');
  };

  return {
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filterAuthors, setFilterAuthors,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    currentPage, setCurrentPage,
    sortField, setSortField,
    sortDirection, setSortDirection,
    categories, authors, years, months,
    filteredPosts, paginatedPosts, totalPages,
    handleSort, toggleAuthor, clearAllFilters,
    postsPerPage
  };
}
