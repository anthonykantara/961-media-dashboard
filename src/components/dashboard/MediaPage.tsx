import { 
  Search, 
  Upload, 
  Filter, 
  Grid, 
  List, 
  FolderPlus,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Link as LinkIcon,
  Link2Off,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  FolderInput,
  CheckSquare,
  Square,
  Copy,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useMedia } from './media/useMedia';
import { initialMedia } from './media/mockData';
import MediaBreadcrumbs from './media/MediaBreadcrumbs';
import MediaItemCard from './media/MediaItem';
import FileDetails from './media/FileDetails';
import StorageMetrics from './media/StorageMetrics';
import MediaTableView from './media/MediaTableView';
import { NewFolderModal, UploadModal, BulkMoveModal } from './media/MediaModals';
import { MediaItem as MediaItemType, MediaType, SortOption } from './media/types';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from '../../hooks/useModal';

export default function MediaPage() {
  const {
    media,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    linkFilter, setLinkFilter,
    sortBy, setSortBy,
    viewMode, setViewMode,
    selectedIds, toggleSelect, selectAll, clearSelection,
    bulkDelete, bulkMove,
    breadcrumbs,
    filteredMedia,
    currentFolderId,
    navigateToFolder,
    deleteItem,
    updateItem,
    addItem,
    createFolder,
    storageStats,
    sortField,
    sortDirection,
    handleSort,
    isLoading
  } = useMedia(initialMedia);

  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isLinkFilterOpen, setIsLinkFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Modals
  const newFolderModal = useModal();
  const uploadModal = useModal();
  const bulkMoveModal = useModal();

  const typeOptions: { label: string; value: MediaType | 'all'; icon: any }[] = [
    { label: 'All Files', value: 'all', icon: Grid },
    { label: 'Images', value: 'image', icon: ImageIcon },
    { label: 'Videos', value: 'video', icon: Video },
    { label: 'Documents', value: 'document', icon: FileText },
    { label: 'Audio', value: 'audio', icon: Music },
  ];

  const linkOptions: { label: string; value: 'all' | 'linked' | 'unlinked'; icon: any }[] = [
    { label: 'All Links', value: 'all', icon: Filter },
    { label: 'Linked', value: 'linked', icon: LinkIcon },
    { label: 'Unlinked', value: 'unlinked', icon: Link2Off },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Size (Largest)', value: 'size-desc' },
    { label: 'Size (Smallest)', value: 'size-asc' },
    { label: 'Alphabetical', value: 'name-asc' },
  ];

  const handleCopyBulkLinks = () => {
    const urls = media
      .filter(m => selectedIds.includes(m.id) && m.url)
      .map(m => m.url)
      .join('\n');
    if (urls) {
      navigator.clipboard.writeText(urls);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
      {/* Storage Metrics Header Bar */}
      <StorageMetrics stats={storageStats} />

      {/* Search and Primary Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-700"
          />
        </div>
        
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => newFolderModal.openModal()}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-primary" />
            <span>New Folder</span>
          </button>
          
          <button 
            onClick={() => uploadModal.openModal()}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-primary transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Filters, Sorting & View Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="relative">
            <button 
              onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsLinkFilterOpen(false); setIsSortOpen(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer ${
                filterType !== 'all' ? 'text-primary bg-red-50/50' : 'text-gray-600'
              }`}
            >
              <span>{typeOptions.find(o => o.value === filterType)?.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isTypeFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsTypeFilterOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl z-20 shadow-lg overflow-hidden p-1"
                  >
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterType(option.value);
                          setIsTypeFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          filterType === option.value ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <option.icon className="w-3.5 h-3.5" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Link Filter */}
          <div className="relative">
            <button 
              onClick={() => { setIsLinkFilterOpen(!isLinkFilterOpen); setIsTypeFilterOpen(false); setIsSortOpen(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer ${
                linkFilter !== 'all' ? 'text-primary bg-red-50/50' : 'text-gray-600'
              }`}
            >
              <span>{linkOptions.find(o => o.value === linkFilter)?.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLinkFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLinkFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLinkFilterOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl z-20 shadow-lg overflow-hidden p-1"
                  >
                    {linkOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLinkFilter(option.value);
                          setIsLinkFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          linkFilter === option.value ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <option.icon className="w-3.5 h-3.5" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Sort By Dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setIsSortOpen(!isSortOpen); setIsTypeFilterOpen(false); setIsLinkFilterOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl z-20 shadow-lg overflow-hidden p-1"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          sortBy === option.value ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* View Mode Switcher & Select All */}
        <div className="flex items-center gap-2">
          {filteredMedia.length > 0 && (
            <button 
              onClick={selectAll}
              className="px-2.5 py-1.5 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Toggle Select All"
            >
              {selectedIds.length === filteredMedia.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Square className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span>Select All</span>
            </button>
          )}

          <div className="w-px h-4 bg-gray-200" />

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Table List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <MediaBreadcrumbs 
        breadcrumbs={breadcrumbs} 
        onNavigate={navigateToFolder} 
      />

      {/* Main Content Area: Grid or Table List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <MediaItemCard 
              key={item.id} 
              item={item} 
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={toggleSelect}
              onNavigate={navigateToFolder}
              onDelete={deleteItem}
              onShowDetails={setSelectedItem}
            />
          ))}
        </div>
      ) : (
        <MediaTableView 
          items={filteredMedia}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
          onNavigate={navigateToFolder}
          onDelete={deleteItem}
          onShowDetails={setSelectedItem}
          sortField={sortField as string}
          sortDirection={sortDirection}
          onSort={handleSort}
          isLoading={isLoading}
        />
      )}

      {/* Empty State */}
      {!isLoading && filteredMedia.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-xs font-bold text-gray-900">No media items found</h3>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your filter options or upload a new file</p>
        </div>
      )}

      {/* Floating Multi-Select Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-800"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-semibold">Selected</span>
            </div>

            <div className="w-px h-4 bg-gray-700" />

            <div className="flex items-center gap-2">
              <button 
                onClick={() => bulkMoveModal.openModal()}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FolderInput className="w-3.5 h-3.5 text-primary" />
                <span>Move to Folder</span>
              </button>

              <button 
                onClick={handleCopyBulkLinks}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Links</span>
              </button>

              <button 
                onClick={bulkDelete}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            </div>

            <button 
              onClick={clearSelection}
              className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all ml-2 cursor-pointer"
              title="Deselect All"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <NewFolderModal 
        isOpen={newFolderModal.isOpen}
        onClose={newFolderModal.closeModal}
        onCreateFolder={createFolder}
      />

      <UploadModal 
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.closeModal}
        currentFolderId={currentFolderId}
        onAddItem={addItem}
      />

      <BulkMoveModal 
        isOpen={bulkMoveModal.isOpen}
        onClose={bulkMoveModal.closeModal}
        folders={media}
        selectedCount={selectedIds.length}
        onMove={bulkMove}
      />

      <FileDetails 
        item={selectedItem} 
        folders={media}
        onClose={() => setSelectedItem(null)} 
        onUpdate={updateItem}
      />
    </div>
  );
}
