import { 
  Plus, 
  Search, 
  Layers
} from 'lucide-react';
import { useState } from 'react';
import { useCategories } from './categories/useCategories';
import { initialCategories } from './categories/mockData';
import CategoryTable from './categories/CategoryTable';
import { AddCategoryModal, EditCategoryModal, DeleteCategoryModal } from './categories/CategoryModals';
import { Category } from './categories/types';

export default function CategoriesPage() {
  const {
    searchQuery, setSearchQuery,
    filteredCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    categories
  } = useCategories(initialCategories);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
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
          onClick={() => setIsAddModalOpen(true)}
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
      />

      {filteredCategories.length === 0 && (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Layers className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No sections found</h3>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search query</p>
        </div>
      )}

      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(cat) => {
          addCategory(cat);
          setIsAddModalOpen(false);
        }} 
      />

      <EditCategoryModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        categoryToEdit={categoryToEdit} 
        onUpdate={(id, updatedFields) => {
          updateCategory(id, updatedFields);
          setIsEditModalOpen(false);
        }} 
      />

      <DeleteCategoryModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        categoryToDelete={categoryToDelete} 
        categories={categories} 
        onDelete={deleteCategory} 
      />
    </div>
  );
}
