import { 
  User, 
  Calendar,
  Eye,
  Send,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, SortField, SortDirection } from './types';

interface PostTableProps {
  posts: Post[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export default function PostTable({
  posts,
  sortField,
  sortDirection,
  onSort
}: PostTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="pl-8 pr-6 py-5 text-xs font-semibold text-gray-500 text-left w-[352px]">
                Article
              </th>
              <th className="px-6 py-5 text-xs font-semibold text-gray-500 text-center">
                Section
              </th>
              <th className="px-6 py-5 text-xs font-semibold text-gray-500 text-center">
                <Clock className="w-4 h-4 mx-auto" />
              </th>
              <th className="px-8 py-5 text-xs font-semibold text-gray-500 text-center">
                <User className="w-4 h-4 mx-auto" />
              </th>
              <th 
                className="px-6 py-5 text-xs font-semibold text-gray-500 text-center cursor-pointer hover:bg-gray-50/50 transition-colors group/sort"
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
              <th className="px-6 py-5 text-xs font-semibold text-gray-500 text-center">
                <Edit className="w-4 h-4 mx-auto" />
              </th>
              <th 
                className="px-2 py-5 text-xs font-semibold text-gray-500 text-center w-16 cursor-pointer hover:bg-gray-50/50 transition-colors group/sort"
                onClick={() => onSort('views')}
              >
                <div className="flex flex-col items-center gap-1">
                  <Eye className={`w-4 h-4 transition-colors ${sortField === 'views' ? 'text-primary' : 'group-hover/sort:text-gray-600'}`} />
                  <div className="flex items-center gap-0.5">
                    {sortField === 'views' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-2 h-2 text-primary" /> : <ArrowDown className="w-2 h-2 text-primary" />
                    ) : (
                      <ArrowUpDown className="w-2 h-2 opacity-0 group-hover/sort:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </th>
              <th 
                className="px-2 py-5 text-xs font-semibold text-gray-500 text-center w-16 cursor-pointer hover:bg-gray-50/50 transition-colors group/sort"
                onClick={() => onSort('shares')}
              >
                <div className="flex flex-col items-center gap-1">
                  <Send className={`w-4 h-4 transition-colors ${sortField === 'shares' ? 'text-primary' : 'group-hover/sort:text-gray-600'}`} />
                  <div className="flex items-center gap-0.5">
                    {sortField === 'shares' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-2 h-2 text-primary" /> : <ArrowDown className="w-2 h-2 text-primary" />
                    ) : (
                      <ArrowUpDown className="w-2 h-2 opacity-0 group-hover/sort:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="pl-8 pr-6 py-4 w-[352px]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/dashboard/posts/${post.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-3 hover:text-primary cursor-pointer leading-relaxed transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center w-32">
                  <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mx-auto">
                    {post.category.split(', ').map((cat, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-center w-24">
                  <span className="text-xs font-medium text-gray-400">{post.status}</span>
                </td>
                <td className="px-8 py-4 text-center w-48">
                  <div className="flex flex-col items-center gap-0.5">
                    {Array.isArray(post.author) ? (
                      post.author.map((a, i) => (
                        <span key={i} className="text-xs font-medium text-gray-400 whitespace-nowrap">{a}</span>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{post.author}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center w-32">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-medium text-gray-900">{post.date}</span>
                    <span className="text-[10px] font-medium text-gray-400">{post.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center w-32">
                  {post.isEdited ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-medium text-gray-900">{post.editDate}</span>
                      <span className="text-[10px] font-medium text-gray-400">{post.editTime}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-300">—</span>
                  )}
                </td>
                <td className="px-2 py-4 text-center w-16">
                  <span className="text-xs font-medium text-gray-900">{post.views}</span>
                </td>
                <td className="px-2 py-4 text-center w-16">
                  <span className="text-xs font-medium text-gray-900">{post.shares}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
