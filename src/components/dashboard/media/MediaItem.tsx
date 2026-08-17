import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  MoreVertical,
  ExternalLink,
  Trash2,
  Info,
  Link as LinkIcon,
  Link2Off
} from 'lucide-react';
import { MediaItem as MediaItemType } from './types';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaItemProps {
  item: MediaItemType;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onNavigate: (id: string | null) => void;
  onDelete: (id: string) => void;
  onShowDetails: (item: MediaItemType | null) => void;
}

const MediaItemComponent: React.FC<MediaItemProps> = ({ 
  item, 
  isSelected = false, 
  onToggleSelect, 
  onNavigate, 
  onDelete, 
  onShowDetails 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'folder': return <Folder className="w-9 h-9" style={{ color: item.folderColor || '#FF0000', fill: `${item.folderColor || '#FF0000'}15` }} />;
      case 'image': return <ImageIcon className="w-9 h-9 text-blue-500" />;
      case 'video': return <Video className="w-9 h-9 text-purple-500" />;
      case 'audio': return <Music className="w-9 h-9 text-green-500" />;
      default: return <FileText className="w-9 h-9 text-gray-400" />;
    }
  };

  const isLinked = item.type !== 'folder' && item.linkedTo && item.linkedTo.length > 0;

  return (
    <div 
      onClick={() => item.type === 'folder' ? onNavigate(item.id) : onShowDetails(item)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer p-4 ${
        isSelected ? 'border-primary ring-2 ring-primary/20 bg-red-50/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
      }`}
    >
      {/* Checkbox overlay */}
      {onToggleSelect && (
        <div 
          className="absolute top-3 left-3 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id);
          }}
        >
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer accent-[#FF0000]"
          />
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-3">
        <div 
          className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 transition-transform duration-200 group-hover:scale-102"
        >
          {item.type === 'image' && item.url ? (
            <img 
              src={item.url} 
              alt={item.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            getIcon()
          )}
        </div>
        
        <div className="space-y-1 w-full px-1">
          <p className="text-xs font-semibold text-gray-900 truncate" title={item.name}>
            {item.name}
          </p>
          {item.type !== 'folder' && (
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[11px] font-medium text-gray-400">
                {item.size ? (item.size / 1024).toFixed(0) + ' KB' : 'N/A'}
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <div className={`flex items-center gap-1 ${isLinked ? 'text-green-600' : 'text-amber-500'}`}>
                {isLinked ? <LinkIcon className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />}
                <span className="text-[10px] font-medium">
                  {isLinked ? 'Linked' : 'Unlinked'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action menu button */}
      <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl z-20 shadow-lg overflow-hidden p-1 text-left"
              >
                {item.type !== 'folder' && (
                  <>
                    <button 
                      onClick={() => {
                        onShowDetails(item);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                      <span>Details</span>
                    </button>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        <span>View Original</span>
                      </a>
                    )}
                  </>
                )}
                {item.type === 'folder' && (
                  <button 
                    onClick={() => {
                      onNavigate(item.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <Folder className="w-3.5 h-3.5 text-primary" />
                    <span>Open Folder</span>
                  </button>
                )}
                <div className="h-px bg-gray-100 my-1" />
                <button 
                  onClick={() => {
                    onDelete(item.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default MediaItemComponent;
