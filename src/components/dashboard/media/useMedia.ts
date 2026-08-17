import { useState, useMemo } from 'react';
import { MediaItem, MediaType, SortOption } from './types';

export function useMedia(initialData: MediaItem[]) {
  const [media, setMedia] = useState<MediaItem[]>(initialData);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [linkFilter, setLinkFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return media.find(item => item.id === currentFolderId);
  }, [currentFolderId, media]);

  const breadcrumbs = useMemo(() => {
    const path: MediaItem[] = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = media.find(item => item.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path;
  }, [currentFolderId, media]);

  const filteredMedia = useMemo(() => {
    let result = media.filter(item => {
      // Folder navigation logic
      const isCorrectFolder = item.parentId === currentFolderId;
      
      // Search logic
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter logic
      const matchesType = filterType === 'all' || item.type === filterType;
      
      // Link filter logic
      let matchesLink = true;
      if (item.type !== 'folder') {
        const isLinked = item.linkedTo && item.linkedTo.length > 0;
        if (linkFilter === 'linked') matchesLink = !!isLinked;
        if (linkFilter === 'unlinked') matchesLink = !isLinked;
      }

      return isCorrectFolder && matchesSearch && matchesType && matchesLink;
    });

    // Sorting logic (folders stay at top, sorted amongst themselves)
    result.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size-desc':
          return (b.size || 0) - (a.size || 0);
        case 'size-asc':
          return (a.size || 0) - (b.size || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [media, currentFolderId, searchQuery, filterType, linkFilter, sortBy]);

  const storageStats = useMemo(() => {
    let totalSize = 0;
    let imageSize = 0;
    let videoSize = 0;
    let docSize = 0;
    let audioSize = 0;

    media.forEach(item => {
      if (item.size) {
        totalSize += item.size;
        if (item.type === 'image') imageSize += item.size;
        if (item.type === 'video') videoSize += item.size;
        if (item.type === 'document') docSize += item.size;
        if (item.type === 'audio') audioSize += item.size;
      }
    });

    return {
      totalSize,
      imageSize,
      videoSize,
      docSize,
      audioSize,
      maxSize: 100 * 1024 * 1024 * 1024 // 100 GB limit mock
    };
  }, [media]);

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
    setSelectedIds([]);
  };

  const deleteItem = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const updateItem = (id: string, updates: Partial<MediaItem>) => {
    setMedia(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const addItem = (newItem: MediaItem) => {
    setMedia(prev => [newItem, ...prev]);
  };

  const createFolder = (name: string, color?: string) => {
    const newFolder: MediaItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      folderColor: color || '#FF0000'
    };
    addItem(newFolder);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const bulkDelete = () => {
    setMedia(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const bulkMove = (targetFolderId: string | null) => {
    setMedia(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, parentId: targetFolderId } : item
    ));
    setSelectedIds([]);
  };

  return {
    media,
    currentFolderId,
    currentFolder,
    breadcrumbs,
    filteredMedia,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    linkFilter,
    setLinkFilter,
    sortBy,
    setSortBy,
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
    storageStats
  };
}

