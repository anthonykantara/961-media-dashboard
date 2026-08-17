import { HardDrive, Image as ImageIcon, Video, FileText, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface StorageMetricsProps {
  stats: {
    totalSize: number;
    imageSize: number;
    videoSize: number;
    docSize: number;
    audioSize: number;
    maxSize: number;
  };
}

export default function StorageMetrics({ stats }: StorageMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  const usedPercent = Math.min(100, Math.max(1, (stats.totalSize / stats.maxSize) * 100));
  const imagePercent = (stats.imageSize / stats.maxSize) * 100;
  const videoPercent = (stats.videoSize / stats.maxSize) * 100;
  const audioPercent = (stats.audioSize / stats.maxSize) * 100;
  const docPercent = (stats.docSize / stats.maxSize) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <HardDrive className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-sm font-bold text-gray-900">Media Storage</h4>
              <span className="text-xs font-semibold text-gray-500">
                {formatSize(stats.totalSize)} of {formatSize(stats.maxSize)} used ({usedPercent.toFixed(1)}%)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Cloud CDN Asset Storage</p>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Stats' : 'Storage Breakdown'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex my-3">
        <div style={{ width: `${Math.max(0.5, imagePercent)}%` }} className="bg-blue-500 h-full" title="Images" />
        <div style={{ width: `${Math.max(0.5, videoPercent)}%` }} className="bg-purple-500 h-full" title="Videos" />
        <div style={{ width: `${Math.max(0.5, audioPercent)}%` }} className="bg-green-500 h-full" title="Audio" />
        <div style={{ width: `${Math.max(0.5, docPercent)}%` }} className="bg-amber-500 h-full" title="Documents" />
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">Images</p>
              <p className="text-xs font-bold text-gray-900">{formatSize(stats.imageSize)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <Video className="w-3.5 h-3.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">Videos</p>
              <p className="text-xs font-bold text-gray-900">{formatSize(stats.videoSize)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
            <Music className="w-3.5 h-3.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">Audio</p>
              <p className="text-xs font-bold text-gray-900">{formatSize(stats.audioSize)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">Documents</p>
              <p className="text-xs font-bold text-gray-900">{formatSize(stats.docSize)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
