import { 
  Search, 
  Tag, 
  User, 
  Calendar,
  Filter,
  CheckCircle2,
  X,
  Clock,
  AlertCircle,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Post } from './types';

interface PostFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterAuthors: string[];
  toggleAuthor: (author: string) => void;
  setFilterAuthors: (authors: string[]) => void;
  filterMonth: string;
  setFilterMonth: (month: string) => void;
  filterYear: string;
  setFilterYear: (year: string) => void;
  categories: string[];
  authors: string[];
  months: string[];
  years: string[];
  filteredCount: number;
  clearAllFilters: () => void;
}

export default function PostFilters({
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  filterCategory, setFilterCategory,
  filterAuthors, toggleAuthor, setFilterAuthors,
  filterMonth, setFilterMonth,
  filterYear, setFilterYear,
  categories, authors, months, years,
  filteredCount, clearAllFilters
}: PostFiltersProps) {
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  const getStatusIcon = (status: Post['status']) => {
    switch (status) {
      case 'Published': return <CheckCircle2 className="w-3 h-3" />;
      case 'Draft': return <Edit className="w-3 h-3" />;
      case 'Scheduled': return <Clock className="w-3 h-3" />;
      case 'Review': return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Row */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-600"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`p-2.5 rounded-xl border transition-all ${filterStatus !== 'All' ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
              title="Filter by Status"
            >
              <Filter className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isStatusOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl z-20 overflow-hidden p-2"
                  >
                    {['All', 'Published', 'Draft', 'Scheduled', 'Review'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          filterStatus === status ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {status !== 'All' && (
                          <span className={filterStatus === status ? 'text-white' : ''}>
                            {getStatusIcon(status as any)}
                          </span>
                        )}
                        <span>{status === 'All' ? 'All Status' : status === 'Review' ? 'Requires Review' : status}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`p-2.5 rounded-xl border transition-all ${filterCategory !== 'All' ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
              title="Filter by Category"
            >
              <Tag className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl z-20 overflow-hidden p-2"
                  >
                    <button
                      onClick={() => {
                        setFilterCategory('All');
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        filterCategory === 'All' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Sections
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFilterCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          filterCategory === cat ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Author Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsAuthorOpen(!isAuthorOpen)}
              className={`p-2.5 rounded-xl border transition-all ${filterAuthors.length > 0 ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
              title="Filter by Author"
            >
              <User className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isAuthorOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsAuthorOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl z-20 overflow-hidden p-2"
                  >
                    <button
                      onClick={() => {
                        setFilterAuthors([]);
                        setIsAuthorOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 ${
                        filterAuthors.length === 0 ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Authors
                    </button>
                    <div className="max-h-60 overflow-y-auto scrollbar-hide">
                      {authors.map((author) => (
                        <button
                          key={author}
                          onClick={() => toggleAuthor(author)}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all group"
                        >
                          <span className={filterAuthors.includes(author) ? 'text-primary' : ''}>{author}</span>
                          {filterAuthors.includes(author) && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className={`p-2.5 rounded-xl border transition-all ${filterMonth !== 'All' || filterYear !== 'All' ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
              title="Filter by Date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isDateFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDateFilterOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl z-20 overflow-hidden p-4 space-y-4"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Month</p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => setFilterMonth('All')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterMonth === 'All' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          All
                        </button>
                        {months.map(m => (
                          <button
                            key={m}
                            onClick={() => setFilterMonth(m)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterMonth === m ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Year</p>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => setFilterYear('All')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterYear === 'All' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          All
                        </button>
                        {years.map(y => (
                          <button
                            key={y}
                            onClick={() => setFilterYear(y)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterYear === y ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-gray-100 mx-2" />
          
          <p className="text-xs font-semibold text-gray-400">
            {filteredCount} Articles
          </p>
        </div>

        {/* Selected Filters Row */}
        {(filterStatus !== 'All' || filterCategory !== 'All' || filterAuthors.length > 0 || filterMonth !== 'All' || filterYear !== 'All') && (
          <div className="flex flex-wrap items-center gap-2">
            {filterStatus !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-900">
                <span>Status: {filterStatus}</span>
                <button onClick={() => setFilterStatus('All')}><X className="w-3 h-3" /></button>
              </div>
            )}
            {filterCategory !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-900">
                <span>Category: {filterCategory}</span>
                <button onClick={() => setFilterCategory('All')}><X className="w-3 h-3" /></button>
              </div>
            )}
            {filterMonth !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-900">
                <span>Month: {filterMonth}</span>
                <button onClick={() => setFilterMonth('All')}><X className="w-3 h-3" /></button>
              </div>
            )}
            {filterYear !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-900">
                <span>Year: {filterYear}</span>
                <button onClick={() => setFilterYear('All')}><X className="w-3 h-3" /></button>
              </div>
            )}
            {filterAuthors.map(author => (
              <div key={author} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-900">
                <span>{author}</span>
                <button onClick={() => toggleAuthor(author)}><X className="w-3 h-3" /></button>
              </div>
            ))}
            <button 
              onClick={clearAllFilters}
              className="text-xs font-semibold text-primary hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
