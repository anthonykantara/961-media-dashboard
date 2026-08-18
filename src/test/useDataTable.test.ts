import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDataTable } from '../hooks/useDataTable';

interface SampleItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  views: number;
}

const sampleData: SampleItem[] = [
  { id: '1', name: 'Alpha File', type: 'file', views: 100 },
  { id: '2', name: 'Beta Folder', type: 'folder', views: 50 },
  { id: '3', name: 'Gamma File', type: 'file', views: 200 },
  { id: '4', name: 'Delta Folder', type: 'folder', views: 10 },
];

describe('useDataTable', () => {
  it('filters data case-insensitively using searchQuery and searchFields', () => {
    const { result } = renderHook(() =>
      useDataTable<SampleItem>({
        data: sampleData,
        searchFields: ['name'],
      })
    );

    expect(result.current.filteredData).toHaveLength(4);

    act(() => {
      result.current.setSearchQuery('gamma');
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('Gamma File');
  });

  it('sorts items by field in ascending and descending directions', () => {
    const { result } = renderHook(() =>
      useDataTable<SampleItem>({
        data: sampleData,
        initialSortField: 'views',
        initialSortDirection: 'asc',
      })
    );

    expect(result.current.filteredData.map(i => i.views)).toEqual([10, 50, 100, 200]);

    act(() => {
      result.current.handleSort('views');
    });

    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.filteredData.map(i => i.views)).toEqual([200, 100, 50, 10]);
  });

  it('enforces folder pinning via customComparator', () => {
    const customComparator = (a: SampleItem, b: SampleItem) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return 0;
    };

    const { result } = renderHook(() =>
      useDataTable<SampleItem>({
        data: sampleData,
        initialSortField: 'name',
        initialSortDirection: 'asc',
        customComparator,
      })
    );

    // Folders must come first
    const types = result.current.filteredData.map(i => i.type);
    expect(types[0]).toBe('folder');
    expect(types[1]).toBe('folder');
    expect(types[2]).toBe('file');
    expect(types[3]).toBe('file');
  });

  it('paginates data when pageSize is provided', () => {
    const { result } = renderHook(() =>
      useDataTable<SampleItem>({
        data: sampleData,
        pageSize: 2,
      })
    );

    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedData).toHaveLength(2);
    expect(result.current.paginatedData[0].id).toBe('1');

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.paginatedData[0].id).toBe('3');
  });
});
