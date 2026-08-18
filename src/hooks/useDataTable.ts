import React, { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseDataTableOptions<T> {
  data: T[];
  searchQuery?: string;
  searchFields?: (keyof T | ((item: T) => string))[];
  filterFn?: (item: T) => boolean;
  initialSortField?: string | keyof T | null;
  initialSortDirection?: SortDirection;
  customComparator?: (
    a: T,
    b: T,
    sortField: string | keyof T | null,
    sortDirection: SortDirection
  ) => number;
  pageSize?: number;
  initialPage?: number;
  loading?: boolean;
}

export interface UseDataTableReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: string | keyof T | null;
  sortDirection: SortDirection;
  setSortField: (field: string | keyof T | null) => void;
  setSortDirection: (direction: SortDirection) => void;
  handleSort: (field: string | keyof T) => void;
  filteredData: T[];
  paginatedData: T[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function useDataTable<T extends Record<string, any>>({
  data,
  searchQuery: externalSearchQuery,
  searchFields = [],
  filterFn,
  initialSortField = null,
  initialSortDirection = 'desc',
  customComparator,
  pageSize,
  initialPage = 1,
  loading: initialLoading = false,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | keyof T | null>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (query: string) => {
    setInternalSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (field: string | keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        if (searchFields.length > 0) {
          return searchFields.some(field => {
            if (typeof field === 'function') {
              return field(item).toLowerCase().includes(q);
            }
            const val = item[field];
            if (val === null || val === undefined) return false;
            if (Array.isArray(val)) {
              return val.some(v => String(v).toLowerCase().includes(q));
            }
            return String(val).toLowerCase().includes(q);
          });
        }
        return Object.values(item).some(val => {
          if (val === null || val === undefined) return false;
          if (Array.isArray(val)) {
            return val.some(v => String(v).toLowerCase().includes(q));
          }
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Custom filter function
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Sorting logic
    if (customComparator || sortField) {
      result.sort((a, b) => {
        if (customComparator) {
          const customRes = customComparator(a, b, sortField, sortDirection);
          if (customRes !== 0) return customRes;
        }

        if (!sortField) return 0;

        let valA: any = a[sortField as keyof T];
        let valB: any = b[sortField as keyof T];

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
            : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchFields, filterFn, sortField, sortDirection, customComparator]);

  const totalPages = pageSize ? Math.ceil(filteredData.length / pageSize) || 1 : 1;

  const paginatedData = useMemo(() => {
    if (!pageSize) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return {
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    handleSort,
    filteredData,
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: pageSize || filteredData.length,
    totalItems: filteredData.length,
    isLoading,
    setIsLoading,
  };
}
