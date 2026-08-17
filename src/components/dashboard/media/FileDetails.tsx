import { X, ExternalLink, FileText, Layout, Save, Copy, Check, Download, Sparkles, FolderInput } from 'lucide-react';
import { MediaItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface FileDetailsProps {
  item: MediaItem | null;
  folders?: MediaItem[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
}

export default function FileDetails({ item, folders = [], onClose, onUpdate }: FileDetailsProps) {
  const [altText, setAltText] = useState(item?.altText || '');
  const [caption, setCaption] = useState(item?.caption || '');
  const [parentId, setParentId] = useState<string | null>(item?.parentId || null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    if (item) {
      setAltText(item.altText || '');
      setCaption(item.caption || '');
      setParentId(item.parentId || null);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onUpdate(item.id, { altText, caption, parentId });
    onClose();
  };

  const handleCopyUrl = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateAltText = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const cleanName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const generated = `High-resolution visual representing ${cleanName} for editorial story content.`;
      setAltText(generated);
      setIsGeneratingAi(false);
    }, 800);
  };

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">File Details</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 mt-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
                {item.type === 'image' && item.url ? (
                   <img src={item.url} alt={item.altText || item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-gray-300">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs font-medium text-gray-500">
                  {(item.size ? item.size / 1024 : 0).toFixed(0)} KB • {item.dimensions || '1920 × 1080 px'}
                </p>
                <p className="text-[11px] font-medium text-gray-400">
                  Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                </p>

                {/* Quick actions bar */}
                <div className="flex items-center gap-2 pt-2">
                  {item.url && (
                    <button 
                      onClick={handleCopyUrl}
                      className="px-2.5 py-1 bg-white border border-gray-200 hover:border-primary text-gray-700 text-[11px] font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied Link' : 'Copy CDN URL'}</span>
                    </button>
                  )}
                  {item.url && (
                    <a 
                      href={item.url} 
                      download={item.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 bg-white border border-gray-200 hover:border-primary text-gray-700 rounded-lg transition-all"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Folder Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                <FolderInput className="w-3.5 h-3.5 text-primary" />
                <span>Folder Location</span>
              </label>
              <select 
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all"
              >
                <option value="">Root Media Library</option>
                {folders.filter(f => f.type === 'folder').map(folder => (
                  <option key={folder.id} value={folder.id}>📁 {folder.name}</option>
                ))}
              </select>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">SEO Alt Text</label>
                  <button 
                    type="button"
                    onClick={handleGenerateAltText}
                    disabled={isGeneratingAi}
                    className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingAi ? 'Generating...' : 'AI Generate'}</span>
                  </button>
                </div>
                <input 
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the file for SEO & accessibility..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Caption</label>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a public caption for article embeds..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Linked Articles */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-600">Linked Stories</h3>
              {item.linkedTo && item.linkedTo.length > 0 ? (
                <div className="space-y-2">
                  {item.linkedTo.map((link) => (
                    <div 
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        {link.type === 'post' ? (
                          <FileText className="w-4 h-4 text-primary" />
                        ) : (
                          <Layout className="w-4 h-4 text-blue-500" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{link.title}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{link.type}</p>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs font-medium text-gray-400">This file is currently unlinked</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
