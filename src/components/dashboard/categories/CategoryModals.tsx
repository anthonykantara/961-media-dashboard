import { AlertCircle } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { Category } from './types';
import { Modal } from '../../common/Modal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<Category, 'id' | 'count'>) => void;
}

export function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#FF0000'
  });

  const updateSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setNewCategory(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd(newCategory);
    setNewCategory({ name: '', slug: '', description: '', color: '#FF0000' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Section"
      subtitle="Create a new content section"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 ml-1">Section Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. Technology"
              value={newCategory.name}
              onChange={(e) => updateSlug(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 ml-1">Slug</label>
            <input 
              required
              type="text"
              placeholder="technology"
              value={newCategory.slug}
              onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 ml-1">Description</label>
          <textarea 
            required
            placeholder="Describe what this section is about..."
            value={newCategory.description}
            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 ml-1">Brand Color</label>
          <div className="flex items-center gap-4">
            <input 
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
            />
            <input 
              type="text"
              value={newCategory.color}
              onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
              className="flex-1 px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-mono font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-primary transition-all cursor-pointer"
          >
            Create Section
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: Category | null;
  onUpdate: (id: string, updatedFields: Partial<Omit<Category, 'id'>>) => void;
}

export function EditCategoryModal({ isOpen, onClose, categoryToEdit, onUpdate }: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#FF0000'
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        slug: categoryToEdit.slug || '',
        description: categoryToEdit.description || '',
        color: categoryToEdit.color || '#FF0000'
      });
    }
  }, [categoryToEdit]);

  const updateSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit) return;
    onUpdate(categoryToEdit.id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen && !!categoryToEdit}
      onClose={onClose}
      title="Edit Section"
      subtitle="Update section name, slug, and description"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 ml-1">Section Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. Technology"
              value={formData.name}
              onChange={(e) => updateSlug(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 ml-1">Slug</label>
            <input 
              required
              type="text"
              placeholder="technology"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 ml-1">Description</label>
          <textarea 
            required
            placeholder="Describe what this section is about..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 ml-1">Brand Color</label>
          <div className="flex items-center gap-4">
            <input 
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
            />
            <input 
              type="text"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="flex-1 px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-mono font-medium focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-primary transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToDelete: Category | null;
  categories: Category[];
  onDelete: (id: string, transferToId: string) => void;
}

export function DeleteCategoryModal({ isOpen, onClose, categoryToDelete, categories, onDelete }: DeleteCategoryModalProps) {
  const [transferToId, setTransferToId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryToDelete || !transferToId) return;
    onDelete(categoryToDelete.id, transferToId);
    onClose();
    setTransferToId('');
  };

  return (
    <Modal
      isOpen={isOpen && !!categoryToDelete}
      onClose={onClose}
      headerClassName="bg-red-50/50"
      title={
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Delete Category</h3>
            <p className="text-sm text-red-600 font-medium mt-1">Action required: Transfer posts</p>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      {categoryToDelete && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              You are deleting <span className="font-semibold text-gray-900">"{categoryToDelete.name}"</span>. 
              This category currently has <span className="font-semibold text-primary">{categoryToDelete.count} posts</span>. 
              Please select a destination category to transfer these posts to.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 ml-1">Transfer Posts To</label>
            <div className="relative group">
              <select 
                required
                value={transferToId}
                onChange={(e) => setTransferToId(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a category...</option>
                {categories
                  .filter(cat => cat.id !== categoryToDelete.id)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                }
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!transferToId}
              className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Transfer & Delete
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
