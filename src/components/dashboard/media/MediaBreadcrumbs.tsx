import { ChevronRight, Home } from 'lucide-react';
import { MediaItem } from './types';

interface MediaBreadcrumbsProps {
  breadcrumbs: MediaItem[];
  onNavigate: (id: string | null) => void;
}

export default function MediaBreadcrumbs({ breadcrumbs, onNavigate }: MediaBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <button 
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 hover:text-primary transition-colors text-xs font-semibold text-gray-600"
      >
        <Home className="w-4 h-4" />
        <span>Root</span>
      </button>
      
      {breadcrumbs.map((folder) => (
        <div key={folder.id} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          <button 
            onClick={() => onNavigate(folder.id)}
            className="hover:text-primary transition-colors text-xs font-semibold text-gray-600"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}
