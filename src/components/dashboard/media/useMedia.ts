import { useState, useMemo, useEffect } from 'react';
import { MediaItem, MediaType, SortOption } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useMedia(initialData: MediaItem[]) {
  const [media, setMedia] = useState<MediaItem[]>(initialData);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [linkFilter, setLinkFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/api/media`, { headers: authHeaders() })
      .then(async response => {
        if (!response.ok) throw new Error(`Media API returned ${response.status}`);
        const data = await response.json();
        if (mounted && Array.isArray(data)) setMedia(data);
      })
      .catch(error => console.warn('Media API unavailable; using local fallback:', error.message));
    return () => { mounted = false; };
  }, []);

  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return media.find(item => item.id === currentFolderId) || null;
  }, [currentFolderId, media]);

  const breadcrumbs = useMemo(() => {
    const path: MediaItem[] = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = media.find(item => item.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parentId;
    }
    return path;
  }, [currentFolderId, media]);

  const filterFn = (item: MediaItem) => {
    const isCorrectFolder = item.parentId === currentFolderId;
    const matchesType = filterType === 'all' || item.type === filterType;
    let matchesLink = true;
    if (item.type !== 'folder') {
      const isLinked = Boolean(item.linkedTo && item.linkedTo.length > 0);
      if (linkFilter === 'linked') matchesLink = isLinked;
      if (linkFilter === 'unlinked') matchesLink = !isLinked;
    }
    return isCorrectFolder && matchesType && matchesLink;
  };

  const customComparator = (a: MediaItem, b: MediaItem, sortField: string | keyof MediaItem | null, sortDirection: 'asc' | 'desc') => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    if (sortField) {
      if (sortField === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (sortField === 'size') {
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        return sortDirection === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
          : b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
      }
      if (sortField === 'type') return sortDirection === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
    }
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'size-desc': return (b.size || 0) - (a.size || 0);
      case 'size-asc': return (a.size || 0) - (b.size || 0);
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  };

  const dataTable = useDataTable<MediaItem>({ data: media, searchFields: ['name'], filterFn, customComparator });

  const storageStats = useMemo(() => {
    let totalSize = 0, imageSize = 0, videoSize = 0, docSize = 0, audioSize = 0;
    media.forEach(item => {
      if (!item.size) return;
      totalSize += item.size;
      if (item.type === 'image') imageSize += item.size;
      if (item.type === 'video') videoSize += item.size;
      if (item.type === 'document') docSize += item.size;
      if (item.type === 'audio') audioSize += item.size;
    });
    return { totalSize, imageSize, videoSize, docSize, audioSize, maxSize: 100 * 1024 * 1024 * 1024 };
  }, [media]);

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    dataTable.setSearchQuery('');
    setSelectedIds([]);
  };

  const deleteItem = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    fetch(`${API_BASE}/api/media/${id}`, { method: 'DELETE', headers: authHeaders() })
      .catch(error => console.error('Error deleting media item:', error));
  };

  const updateItem = (id: string, updates: Partial<MediaItem>) => {
    setMedia(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    fetch(`${API_BASE}/api/media/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(error => console.error('Error updating media item:', error));
  };

  const addItem = (newItem: MediaItem) => setMedia(prev => [newItem, ...prev]);

  const createFolder = async (name: string, color?: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/media/folders`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId: currentFolderId, folderColor: color || '#FF0000' }),
      });
      if (!response.ok) throw new Error(`Folder API returned ${response.status}`);
      addItem(await response.json());
    } catch (error) {
      console.error('Error creating media folder:', error);
    }
  };

  const bulkDelete = () => {
    const ids = [...selectedIds];
    setMedia(prev => prev.filter(item => !ids.includes(item.id)));
    setSelectedIds([]);
    Promise.all(ids.map(id => fetch(`${API_BASE}/api/media/${id}`, { method: 'DELETE', headers: authHeaders() })))
      .catch(error => console.error('Error deleting media items:', error));
  };

  const bulkMove = (targetFolderId: string | null) => {
    const ids = [...selectedIds];
    setMedia(prev => prev.map(item => ids.includes(item.id) ? { ...item, parentId: targetFolderId } : item));
    setSelectedIds([]);
    Promise.all(ids.map(id => fetch(`${API_BASE}/api/media/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId: targetFolderId }),
    }))).catch(error => console.error('Error moving media items:', error));
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(prev => prev.length === dataTable.filteredData.length ? [] : dataTable.filteredData.map(item => item.id));
  const clearSelection = () => setSelectedIds([]);

  return {
    media,
    currentFolderId,
    currentFolder,
    breadcrumbs,
    filteredMedia: dataTable.filteredData,
    searchQuery: dataTable.searchQuery,
    setSearchQuery: dataTable.setSearchQuery,
    filterType,
    setFilterType,
    linkFilter,
    setLinkFilter,
    sortBy,
    setSortBy: (option: SortOption) => { setSortBy(option); dataTable.setSortField(null); },
    viewMode,
    setViewMode,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkMove,
    navigateToFolder,
    deleteItem,
    updateItem,
    addItem,
    createFolder,
    storageStats,
    sortField: dataTable.sortField,
    sortDirection: dataTable.sortDirection,
    handleSort: dataTable.handleSort,
    isLoading: dataTable.isLoading,
    setIsLoading: dataTable.setIsLoading,
  };
}
