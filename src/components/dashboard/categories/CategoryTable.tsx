import { Edit, Trash2 } from 'lucide-react';
import { Category } from './types';
import { DataTable, Column } from '../../common/DataTable';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  isLoading?: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}: CategoryTableProps) {
  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Section',
      sortable: true,
      headerClassName: 'pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left w-[280px]',
      className: 'pl-8 pr-6 py-4 w-[280px]',
      render: (category) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" 
            style={{ backgroundColor: category.color || '#FF0000' }} 
          />
          <div className="min-w-0">
            <h3 
              onClick={() => onEdit(category)}
              className="text-sm font-semibold text-gray-900 hover:text-primary cursor-pointer transition-colors truncate"
            >
              {category.name}
            </h3>
            <p className="text-xs text-gray-400 font-mono">/{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-left max-w-xs',
      className: 'px-6 py-4 max-w-xs',
      render: (category) => (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{category.description}</p>
      ),
    },
    {
      key: 'count',
      header: 'Articles Count',
      sortable: true,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-center w-36',
      className: 'px-6 py-4 text-center w-36',
      render: (category) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {category.count} posts
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8',
      className: 'px-8 py-4 text-right pr-8',
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onEdit(category)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
            title="Edit Section"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(category)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all cursor-pointer"
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      keyExtractor={(cat) => cat.id}
      isLoading={isLoading}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}
