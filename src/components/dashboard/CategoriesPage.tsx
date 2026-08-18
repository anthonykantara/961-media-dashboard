import { 
  Plus, 
  Search, 
  Layers
} from 'lucide-react';
import { useCategories } from './categories/useCategories';
import { initialCategories } from './categories/mockData';
import CategoryTable from './categories/CategoryTable';
import { AddCategoryModal, EditCategoryModal, DeleteCategoryModal } from './categories/CategoryModals';
import { Category } from './categories/types';
import { useModal } from '../../hooks/useModal';

export default function CategoriesPage() {
  const {
    searchQuery, setSearchQuery,
    filteredCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    categories,
    sortField,
    sortDirection,
    handleSort,
    isLoading
  } = useCategories(initialCategories);

  const addModal = useModal();
  const editModal = useModal<Category>();
  const deleteModal = useModal<Category>();

  const handleEditClick = (category: Category) => {
    editModal.openModal(category);
  };

  const handleDeleteClick = (category: Category) => {
    deleteModal.openModal(category);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-600"
          />
        </div>
        <button 
          onClick={() => addModal.openModal()}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-primary transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      <CategoryTable 
        categories={filteredCategories} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick} 
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
      />

      {!isLoading && filteredCategories.length === 0 && (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Layers className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No sections found</h3>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search query</p>
        </div>
      )}

      <AddCategoryModal 
        isOpen={addModal.isOpen} 
        onClose={addModal.closeModal} 
        onAdd={(cat) => {
          addCategory(cat);
          addModal.closeModal();
        }} 
      />

      <EditCategoryModal 
        isOpen={editModal.isOpen} 
        onClose={editModal.closeModal} 
        categoryToEdit={editModal.data} 
        onUpdate={(id, updatedFields) => {
          updateCategory(id, updatedFields);
          editModal.closeModal();
        }} 
      />

      <DeleteCategoryModal 
        isOpen={deleteModal.isOpen} 
        onClose={deleteModal.closeModal} 
        categoryToDelete={deleteModal.data} 
        categories={categories} 
        onDelete={(id, transferToId) => {
          deleteCategory(id, transferToId);
          deleteModal.closeModal();
        }} 
      />
    </div>
  );
}
