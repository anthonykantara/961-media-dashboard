import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalCount: number;
  postsPerPage: number;
}

export default function PostPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalCount,
  postsPerPage
}: PostPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-gray-200">
      <p className="text-xs font-medium text-gray-400">
        Showing <span className="text-gray-900">{(currentPage - 1) * postsPerPage + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * postsPerPage, totalCount)}</span> of <span className="text-gray-900">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                currentPage === i + 1 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
