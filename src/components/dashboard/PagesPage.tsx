import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, FileText } from 'lucide-react';
import { initialPages } from './pages/mockData';
import { usePages } from './pages/usePages';
import PageTable from './pages/PageTable';
import { AddPageModal, EditPageModal } from './pages/PageModals';
import { Page } from './pages/types';
import { SUPPORTED_LANGUAGES } from '../../types/location';
import { useModal } from '../../hooks/useModal';

export default function PagesPage() {
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderSlot(document.getElementById('dashboard-header-actions'));
  }, []);

  const {
    pages,
    selectedLanguage,
    setSelectedLanguage,
    sortField,
    sortDirection,
    filteredPages,
    handleSort,
    addPage,
    updatePage,
    deletePage,
    isLoading
  } = usePages(initialPages);

  const addModal = useModal();
  const editModal = useModal<Page>();

  const handleEditClick = (page: Page) => {
    editModal.openModal(page);
  };

  // Language count breakdown
  const languageCounts = pages.reduce((acc, p) => {
    const lang = p.language || 'en';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12">
      {/* Portal Add New Page Button to Dashboard Header */}
      {headerSlot && createPortal(
        <button
          type="button"
          onClick={() => addModal.openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Page</span>
        </button>,
        headerSlot
      )}

      {/* Language Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedLanguage('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedLanguage === 'all'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Languages ({pages.length})
          </button>
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
            const count = languageCounts[lang.code] || 0;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedLanguage === lang.code
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {lang.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <PageTable 
        pages={filteredPages}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
        onDelete={deletePage}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {!isLoading && filteredPages.length === 0 && (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No pages found</h3>
          <p className="text-gray-400 text-xs mt-1">There are no pages created for this language</p>
        </div>
      )}

      {/* Modals */}
      <AddPageModal 
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onAdd={addPage}
        initialLanguage={selectedLanguage !== 'all' ? selectedLanguage : 'en'}
      />

      <EditPageModal 
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        pageToEdit={editModal.data}
        onUpdate={updatePage}
      />
    </div>
  );
}
