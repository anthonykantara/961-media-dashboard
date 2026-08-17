import { 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { Category } from './types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left w-[352px]">
                Section
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">
                Slug
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                Description
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-gray-500 text-center">
                Posts
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="pl-8 pr-6 py-4 w-[352px]">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/10"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center w-32">
                  <span className="text-xs font-medium text-gray-400">/{category.slug}</span>
                </td>
                <td className="px-6 py-4 text-left">
                  <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[200px]">{category.description}</p>
                </td>
                <td className="px-8 py-4 text-center w-24">
                  <span className="text-sm font-medium text-gray-900">{category.count}</span>
                </td>
                <td className="px-8 py-4 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(category)}
                      className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-all border border-transparent cursor-pointer" 
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(category)}
                      className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600 transition-all border border-transparent cursor-pointer" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
