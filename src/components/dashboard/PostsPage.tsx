import { usePostContext } from './posts/PostContext';
import { usePosts } from './posts/usePosts';
import PostFilters from './posts/PostFilters';
import PostTable from './posts/PostTable';
import PostPagination from './posts/PostPagination';

export default function PostsPage() {
  const { posts } = usePostContext();
  const {
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filterAuthors, setFilterAuthors,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    currentPage, setCurrentPage,
    sortField, sortDirection,
    categories, authors, years, months,
    filteredPosts, paginatedPosts, totalPages,
    handleSort, toggleAuthor, clearAllFilters,
    postsPerPage
  } = usePosts(posts);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      <PostFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterAuthors={filterAuthors}
        toggleAuthor={toggleAuthor}
        setFilterAuthors={setFilterAuthors}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        categories={categories}
        authors={authors}
        months={months}
        years={years}
        filteredCount={filteredPosts.length}
        clearAllFilters={clearAllFilters}
      />

      <PostTable 
        posts={paginatedPosts}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <PostPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalCount={filteredPosts.length}
        postsPerPage={postsPerPage}
      />
    </div>
  );
}
