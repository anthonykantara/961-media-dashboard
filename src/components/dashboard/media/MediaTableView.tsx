import React from 'react';
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
  Link2Off,
  Copy,
  Check
} from 'lucide-react';
import { MediaItem } from './types';
import { useState } from 'react';

interface MediaTableViewProps {
  items: MediaItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onNavigate: (id: string | null) => void;
  onDelete: (id: string) => void;
  onShowDetails: (item: MediaItem) => void;
}

export default function MediaTableView({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onNavigate,
  onDelete,
  onShowDetails
}: MediaTableViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));

  const getItemIcon = (item: MediaItem) => {
    switch (item.type) {
      case 'folder': return <Folder className="w-5 h-5 text-primary" style={{ color: item.folderColor || '#FF0000' }} />;
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio': return <Music className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input 
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-[#FF0000]"
                />
              </th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4">Linked Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isLinked = item.type !== 'folder' && item.linkedTo && item.linkedTo.length > 0;

              return (
                <tr 
                  key={item.id}
                  onClick={() => item.type === 'folder' ? onNavigate(item.id) : onShowDetails(item)}
                  className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-red-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-[#FF0000]"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {item.type === 'image' && item.url ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          getItemIcon(item)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate max-w-[240px] text-xs">{item.name}</p>
                        {item.dimensions && (
                          <p className="text-[10px] text-gray-400 font-medium">{item.dimensions}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="capitalize font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md text-[11px]">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-medium text-gray-500">
                    {item.type === 'folder' ? '—' : item.size ? (item.size / 1024).toFixed(0) + ' KB' : 'N/A'}
                  </td>

                  <td className="py-3 px-4 font-medium text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    {item.type === 'folder' ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                        isLinked ? 'text-green-600' : 'text-amber-500'
                      }`}>
                        {isLinked ? <LinkIcon className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />}
                        <span>{isLinked ? `${item.linkedTo?.length} Linked` : 'Unlinked'}</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {item.url && (
                        <button 
                          onClick={() => handleCopy(item.url!, item.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button 
                        onClick={() => onShowDetails(item)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                        title="File Details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
