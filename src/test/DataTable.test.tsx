import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable, Column } from '../components/common/DataTable';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'First Item' },
  { id: '2', name: 'Second Item' },
];

const columns: Column<Item>[] = [
  {
    key: 'name',
    header: 'Name Header',
    sortable: true,
    render: (item) => <span>{item.name}</span>,
  },
];

describe('DataTable', () => {
  it('renders data table headers and row contents', () => {
    render(
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText('Name Header')).toBeInTheDocument();
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });

  it('renders standard loading skeletons when isLoading is true', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
        isLoading={true}
        loadingRows={3}
      />
    );

    const animatePulseRows = container.querySelectorAll('tr.animate-pulse');
    expect(animatePulseRows).toHaveLength(3);
  });

  it('calls onSort when a sortable column header is clicked', () => {
    const onSortMock = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id}
        onSort={onSortMock}
      />
    );

    fireEvent.click(screen.getByText('Name Header'));
    expect(onSortMock).toHaveBeenCalledWith('name');
  });
});
