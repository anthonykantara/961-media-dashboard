import { 
  User, 
  Calendar,
  Edit,
  Trash2,
  Clock,
  Globe
} from 'lucide-react';
import { Page, SortField, SortDirection } from './types';
import { SUPPORTED_LANGUAGES } from '../../../types/location';
import { DataTable, Column } from '../../common/DataTable';

interface PageTableProps {
  pages: Page[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (page: Page) => void;
  onDelete: (pageId: string) => void;
  isLoading?: boolean;
}

export default function PageTable({
  pages,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  isLoading = false,
}: PageTableProps) {
  const columns: Column<Page>[] = [
    {
      key: 'title',
      header: 'Page Title',
      sortable: true,
      sortField: 'title',
      headerClassName: 'pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left w-[340px] cursor-pointer hover:bg-gray-50/50 transition-colors group/sort',
      className: 'pl-8 pr-6 py-4 w-[340px]',
      render: (page) => (
        <div className="min-w-0">
          <h3 
            onClick={() => onEdit(page)}
            className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#FF0000] cursor-pointer leading-relaxed transition-colors"
          >
            {page.title}
          </h3>
          <p className="text-xs text-gray-400 font-medium">{page.slug}</p>
        </div>
      ),
    },
    {
      key: 'language',
      header: <Globe className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-center',
      className: 'px-6 py-4 text-center w-28',
      render: (page) => {
        const langCode = page.language || 'en';
        const langInfo = SUPPORTED_LANGUAGES[langCode];
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {langInfo ? `${langInfo.short} · ${langInfo.name}` : langCode.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: <Clock className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-center',
      className: 'px-6 py-4 text-center w-32',
      render: (page) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
          page.status === 'Published' 
            ? 'bg-green-50 text-green-600 border border-green-100' 
            : 'bg-orange-50 text-orange-600 border border-orange-100'
        }`}>
          {page.status}
        </span>
      ),
    },
    {
      key: 'author',
      header: <User className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-8 py-4 text-xs font-semibold text-gray-500 text-center',
      className: 'px-8 py-4 text-center w-44',
      render: (page) => (
        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{page.author}</span>
      ),
    },
    {
      key: 'date',
      sortable: true,
      sortField: 'date',
      header: (
        <div className="flex flex-col items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
      ),
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-center cursor-pointer hover:bg-gray-50/50 transition-colors group/sort',
      className: 'px-6 py-4 text-center w-32',
      render: (page) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-medium text-gray-900">{page.date}</span>
          <span className="text-[10px] font-medium text-gray-400">{page.time}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8',
      className: 'px-8 py-4 text-right pr-8',
      render: (page) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onEdit(page)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer" 
            title="Edit Page"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(page.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all cursor-pointer" 
            title="Delete Page"
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
      data={pages}
      keyExtractor={(page) => page.id}
      isLoading={isLoading}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={(field) => onSort(field as SortField)}
    />
  );
}
