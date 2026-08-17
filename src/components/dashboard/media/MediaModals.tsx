import { X, FolderPlus, Upload, CheckCircle2, FolderInput, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { MediaItem, MediaType } from './types';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string, color?: string) => void;
}

export function NewFolderModal({ isOpen, onClose, onCreateFolder }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#FF0000');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onCreateFolder(folderName.trim(), folderColor);
    setFolderName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 sm:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Create New Folder</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Folder Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Campaign Graphics"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Accent Tag Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color"
                    value={folderColor}
                    onChange={(e) => setFolderColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-gray-600">{folderColor}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
  onAddItem: (item: MediaItem) => void;
}

export function UploadModal({ isOpen, onClose, currentFolderId, onAddItem }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const startUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSuccess(true);

          let detectedType: MediaType = 'document';
          if (file.type.startsWith('image/')) detectedType = 'image';
          else if (file.type.startsWith('video/')) detectedType = 'video';
          else if (file.type.startsWith('audio/')) detectedType = 'audio';

          const newItem: MediaItem = {
            id: `upload-${Date.now()}`,
            name: file.name,
            type: detectedType,
            size: file.size,
            url: previewUrl || 'https://picsum.photos/seed/uploaded/800/600',
            parentId: currentFolderId,
            createdAt: new Date().toISOString(),
            linkedTo: []
          };

          onAddItem(newItem);

          setTimeout(() => {
            setFile(null);
            setPreviewUrl(null);
            setUploadProgress(0);
            setIsSuccess(false);
            onClose();
          }, 1000);

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 sm:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Upload Media File</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 mt-5">
              <input 
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!file && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl bg-gray-50/50 flex flex-col items-center text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-all mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Click to browse or drag & drop</p>
                  <p className="text-[11px] text-gray-400 mt-1">Supports JPG, PNG, WEBP, MP4, PDF up to 50MB</p>
                </div>
              )}

              {file && (
                <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {(file.size / 1024).toFixed(0)} KB • {file.type || 'Media File'}
                    </p>

                    {isUploading && (
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div style={{ width: `${uploadProgress}%` }} className="bg-primary h-full transition-all" />
                      </div>
                    )}

                    {isSuccess && (
                      <p className="text-[11px] font-semibold text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Uploaded Successfully!</span>
                      </p>
                    )}
                  </div>

                  {!isUploading && !isSuccess && (
                    <button 
                      onClick={() => { setFile(null); setPreviewUrl(null); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={!file || isUploading || isSuccess}
                  onClick={startUpload}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? `Uploading (${uploadProgress}%)` : 'Start Upload'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface BulkMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: MediaItem[];
  selectedCount: number;
  onMove: (targetFolderId: string | null) => void;
}

export function BulkMoveModal({ isOpen, onClose, folders, selectedCount, onMove }: BulkMoveModalProps) {
  const [targetId, setTargetId] = useState<string | null>(null);

  const handleMove = () => {
    onMove(targetId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 sm:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <FolderInput className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Move {selectedCount} Selected Items</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Select Destination Folder</label>
                <select 
                  value={targetId || ''}
                  onChange={(e) => setTargetId(e.target.value || null)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all"
                >
                  <option value="">Root Media Library</option>
                  {folders.filter(f => f.type === 'folder').map(folder => (
                    <option key={folder.id} value={folder.id}>📁 {folder.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleMove}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all cursor-pointer"
                >
                  Move Items
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
