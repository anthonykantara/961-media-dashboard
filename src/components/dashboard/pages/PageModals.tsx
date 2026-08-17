import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent, useEffect } from 'react';
import { Page } from './types';
import { SUPPORTED_LANGUAGES } from '../../../types/location';
import { useLocationContext } from '../../../context/LocationContext';

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (page: Omit<Page, 'id' | 'date' | 'time'>) => void;
  initialLanguage?: string;
}

export function AddPageModal({ isOpen, onClose, onAdd, initialLanguage = 'en' }: AddPageModalProps) {
  const { activeLocation, activeLanguage } = useLocationContext();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [language, setLanguage] = useState(initialLanguage || activeLanguage || 'en');
  const [author, setAuthor] = useState('Anthony Rahayel');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSlug('');
      setStatus('Published');
      setLanguage(initialLanguage || activeLanguage || 'en');
    }
  }, [isOpen, initialLanguage, activeLanguage]);

  const updateSlug = (val: string) => {
    setTitle(val);
    const generatedSlug = '/' + (language !== 'en' ? `${language}/` : '') + val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-/]+/g, '');
    setSlug(generatedSlug);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (title) {
      const cleanSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setSlug('/' + (newLang !== 'en' ? `${newLang}/` : '') + cleanSlug);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      status,
      author,
      language,
      locationId: activeLocation?.id || 'lb',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">Add New Page</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Create a static or custom content page</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Language</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        language === lang.code
                          ? 'bg-[#FF0000] text-white border-[#FF0000]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold">{lang.short}</div>
                      <div className="text-[10px] opacity-80 truncate">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Page Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. About Us"
                  value={title}
                  onChange={(e) => updateSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">URL Slug</label>
                <input 
                  required
                  type="text"
                  placeholder="/about"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Author</label>
                  <input 
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Create Page
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageToEdit: Page | null;
  onUpdate: (id: string, updatedFields: Partial<Page>) => void;
}

export function EditPageModal({ isOpen, onClose, pageToEdit, onUpdate }: EditPageModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [language, setLanguage] = useState('en');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title);
      setSlug(pageToEdit.slug);
      setStatus(pageToEdit.status);
      setLanguage(pageToEdit.language || 'en');
      setAuthor(pageToEdit.author);
    }
  }, [pageToEdit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pageToEdit) return;
    onUpdate(pageToEdit.id, {
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      status,
      language,
      author,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">Edit Page</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Modify page details</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Language</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        language === lang.code
                          ? 'bg-[#FF0000] text-white border-[#FF0000]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold">{lang.short}</div>
                      <div className="text-[10px] opacity-80 truncate">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Page Title</label>
                <input 
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">URL Slug</label>
                <input 
                  required
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Author</label>
                  <input 
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF0000] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
