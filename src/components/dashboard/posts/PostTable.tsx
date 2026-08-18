import { 
  User, 
  Calendar,
  Eye,
  Send,
  Edit,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, SortField, SortDirection } from './types';
import { DataTable, Column } from '../../common/DataTable';

interface PostTableProps {
  posts: Post[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  isLoading?: boolean;
}

export default function PostTable({
  posts,
  sortField,
  sortDirection,
  onSort,
  isLoading = false
}: PostTableProps) {
  const columns: Column<Post>[] = [
    {
      key: 'title',
      header: 'Article',
      headerClassName: 'pl-8 pr-6 py-5 text-xs font-semibold text-gray-500 text-left w-[352px]',
      className: 'pl-8 pr-6 py-4 w-[352px]',
      render: (post) => (
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
      ),
    },
    {
      key: 'category',
      header: 'Section',
      headerClassName: 'px-6 py-5 text-xs font-semibold text-gray-500 text-center',
      className: 'px-6 py-4 text-center w-32',
      render: (post) => (
        <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mx-auto">
          {post.category.split(', ').map((cat, idx) => (
            <span key={idx} className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
              {cat}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: <Clock className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-6 py-5 text-xs font-semibold text-gray-500 text-center',
      className: 'px-6 py-4 text-center w-24',
      render: (post) => <span className="text-xs font-medium text-gray-400">{post.status}</span>,
    },
    {
      key: 'author',
      header: <User className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-8 py-5 text-xs font-semibold text-gray-500 text-center',
      className: 'px-8 py-4 text-center w-48',
      render: (post) => (
        <div className="flex flex-col items-center gap-0.5">
          {Array.isArray(post.author) ? (
            post.author.map((a, i) => (
              <span key={i} className="text-xs font-medium text-gray-400 whitespace-nowrap">{a}</span>
            ))
          ) : (
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{post.author}</span>
          )}
        </div>
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
      headerClassName: 'px-6 py-5 text-xs font-semibold text-gray-500 text-center cursor-pointer hover:bg-gray-50/50 transition-colors group/sort',
      className: 'px-6 py-4 text-center w-32',
      render: (post) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-medium text-gray-900">{post.date}</span>
          <span className="text-[10px] font-medium text-gray-400">{post.time}</span>
        </div>
      ),
    },
    {
      key: 'isEdited',
      header: <Edit className="w-4 h-4 mx-auto text-gray-500" />,
      headerClassName: 'px-6 py-5 text-xs font-semibold text-gray-500 text-center',
      className: 'px-6 py-4 text-center w-32',
      render: (post) => (
        post.isEdited ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium text-gray-900">{post.editDate}</span>
            <span className="text-[10px] font-medium text-gray-400">{post.editTime}</span>
          </div>
        ) : (
          <span className="text-xs font-medium text-gray-300">—</span>
        )
      ),
    },
    {
      key: 'views',
      sortable: true,
      sortField: 'views',
      header: (
        <div className="flex flex-col items-center gap-1">
          <Eye className="w-4 h-4 text-gray-500" />
        </div>
      ),
      headerClassName: 'px-2 py-5 text-xs font-semibold text-gray-500 text-center w-16 cursor-pointer hover:bg-gray-50/50 transition-colors group/sort',
      className: 'px-2 py-4 text-center w-16',
      render: (post) => <span className="text-xs font-medium text-gray-900">{post.views}</span>,
    },
    {
      key: 'shares',
      sortable: true,
      sortField: 'shares',
      header: (
        <div className="flex flex-col items-center gap-1">
          <Send className="w-4 h-4 text-gray-500" />
        </div>
      ),
      headerClassName: 'px-2 py-5 text-xs font-semibold text-gray-500 text-center w-16 cursor-pointer hover:bg-gray-50/50 transition-colors group/sort',
      className: 'px-2 py-4 text-center w-16',
      render: (post) => <span className="text-xs font-medium text-gray-900">{post.shares}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={posts}
      keyExtractor={(post) => post.id}
      isLoading={isLoading}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={(field) => onSort(field as SortField)}
    />
  );
}
