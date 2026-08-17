import { 
  User, 
  Calendar,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Globe
} from 'lucide-react';
import { Page, SortField, SortDirection } from './types';
import { SUPPORTED_LANGUAGES } from '../../../types/location';

interface PageTableProps {
  pages: Page[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (page: Page) => void;
  onDelete: (pageId: string) => void;
}

export default function PageTable({
  pages,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: PageTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th 
                className="pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left w-[340px] cursor-pointer hover:bg-gray-50/50 transition-colors group/sort"
                onClick={() => onSort('title')}
              >
                <div className="flex items-center gap-2">
                  <span>Page Title</span>
                  {sortField === 'title' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-2 h-2 text-primary" /> : <ArrowDown className="w-2 h-2 text-primary" />
                  ) : (
                    <ArrowUpDown className="w-2 h-2 opacity-0 group-hover/sort:opacity-100 transition-opacity" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">
                <Globe className="w-4 h-4 mx-auto" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">
                <Clock className="w-4 h-4 mx-auto" />
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-gray-500 text-center">
                <User className="w-4 h-4 mx-auto" />
              </th>
              <th 
                className="px-6 py-4 text-xs font-semibold text-gray-500 text-center cursor-pointer hover:bg-gray-50/50 transition-colors group/sort"
                onClick={() => onSort('date')}
              >
                <div className="flex flex-col items-center gap-1">
                  <Calendar className={`w-4 h-4 transition-colors ${sortField === 'date' ? 'text-primary' : 'group-hover/sort:text-gray-600'}`} />
                  <div className="flex items-center gap-0.5">
                    {sortField === 'date' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-2 h-2 text-primary" /> : <ArrowDown className="w-2 h-2 text-primary" />
                    ) : (
                      <ArrowUpDown className="w-2 h-2 opacity-0 group-hover/sort:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map((page) => {
              const langCode = page.language || 'en';
              const langInfo = SUPPORTED_LANGUAGES[langCode];

              return (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="pl-8 pr-6 py-4 w-[340px]">
                    <div className="min-w-0">
                      <h3 
                        onClick={() => onEdit(page)}
                        className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#FF0000] cursor-pointer leading-relaxed transition-colors"
                      >
                        {page.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">{page.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center w-28">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {langInfo ? `${langInfo.short} · ${langInfo.name}` : langCode.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center w-32">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      page.status === 'Published' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center w-44">
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{page.author}</span>
                  </td>
                  <td className="px-6 py-4 text-center w-32">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-medium text-gray-900">{page.date}</span>
                      <span className="text-[10px] font-medium text-gray-400">{page.time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right pr-8">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

