import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from './Skeletons';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  sortField?: string;
  className?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  loadingRows?: number;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T, index: number) => void;
  rowClassName?: string | ((item: T, index: number) => string);
  className?: string;
  tableClassName?: string;
  headerRowClassName?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRows = 5,
  sortField = null,
  sortDirection = 'desc',
  onSort,
  emptyState,
  onRowClick,
  rowClassName = '',
  className = '',
  tableClassName = 'w-full border-collapse',
  headerRowClassName = 'border-b border-gray-100 bg-gray-50/30',
}: DataTableProps<T>) {
  const renderSortIndicator = (col: Column<T>) => {
    if (!col.sortable || !onSort) return null;
    const targetField = col.sortField || col.key;
    const isActive = sortField === targetField;

    return (
      <span className="inline-flex items-center ml-1">
        {isActive ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-primary" />
          ) : (
            <ArrowDown className="w-3 h-3 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/sort:opacity-100 transition-opacity" />
        )}
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className={tableClassName}>
          <thead>
            <tr className={headerRowClassName}>
              {columns.map((col) => {
                const isSortable = col.sortable && !!onSort;
                const targetField = col.sortField || col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-xs font-semibold text-gray-500 text-left ${
                      isSortable ? 'cursor-pointer hover:bg-gray-50/50 transition-colors group/sort' : ''
                    } ${col.headerClassName || ''}`}
                    onClick={() => {
                      if (isSortable && onSort) {
                        onSort(targetField);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {renderSortIndicator(col)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                  {columns.map((col, colIndex) => (
                    <td key={`skeleton-col-${colIndex}`} className={`px-6 py-4 ${col.className || ''}`}>
                      <Skeleton className="h-4 w-3/4 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              emptyState ? (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    {emptyState}
                  </td>
                </tr>
              ) : null
            ) : (
              data.map((item, index) => {
                const key = keyExtractor(item, index);
                const computedRowClass =
                  typeof rowClassName === 'function' ? rowClassName(item, index) : rowClassName;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item, index)}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${computedRowClass}`}
                  >
                    {columns.map((col) => (
                      <td key={`${key}-${col.key}`} className={`px-6 py-4 ${col.className || ''}`}>
                        {col.render ? col.render(item, index) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
