import { FolderPlus, Upload, CheckCircle2, FolderInput, Image as ImageIcon, X } from 'lucide-react';
import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { MediaItem } from './types';
import { Modal } from '../../common/Modal';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

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
    <Modal isOpen={isOpen} onClose={onClose} title={<div className="flex items-center gap-2.5"><FolderPlus className="w-5 h-5 text-primary" /><h3 className="text-lg font-bold text-gray-900">Create New Folder</h3></div>} maxWidth="md" bodyClassName="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600">Folder Name</label><input required type="text" placeholder="e.g. Campaign Graphics" value={folderName} onChange={(e) => setFolderName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all" /></div>
        <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600">Accent Tag Color</label><div className="flex items-center gap-3"><input type="color" value={folderColor} onChange={(e) => setFolderColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" /><span className="text-xs font-mono font-medium text-gray-600">{folderColor}</span></div></div>
        <div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all cursor-pointer">Create Folder</button></div>
      </form>
    </Modal>
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
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const clearFile = () => {
    if (previewObjectUrlRef.current) URL.revokeObjectURL(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 50 * 1024 * 1024) {
      setError('Files must be 50MB or smaller.');
      return;
    }
    clearFile();
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      previewObjectUrlRef.current = url;
      setPreviewUrl(url);
    }
  };

  const startUpload = () => {
    if (!file || isUploading) return;
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/media/upload`);
    xhr.withCredentials = true;
    xhr.responseType = 'json';

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        onAddItem(xhr.response as MediaItem);
        setIsSuccess(true);
        setUploadProgress(100);
        window.setTimeout(() => {
          clearFile();
          setUploadProgress(0);
          setIsSuccess(false);
          onClose();
        }, 800);
        return;
      }
      const message = xhr.response?.error || `Upload failed (${xhr.status}).`;
      setError(message);
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError('Upload failed. Check your connection and try again.');
    };

    xhr.onabort = () => {
      setIsUploading(false);
      setError('Upload was cancelled.');
    };

    const formData = new FormData();
    formData.append('file', file);
    if (currentFolderId) formData.append('parentId', currentFolderId);
    xhr.send(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<div className="flex items-center gap-2.5"><Upload className="w-5 h-5 text-primary" /><h3 className="text-lg font-bold text-gray-900">Upload Media File</h3></div>} maxWidth="lg" bodyClassName="p-6 sm:p-8">
      <div className="space-y-5">
        <input ref={fileInputRef} type="file" onChange={handleFileSelect} accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,audio/mpeg,audio/mp4,audio/wav,audio/ogg,application/pdf" className="hidden" />
        {!file && <div onClick={() => fileInputRef.current?.click()} className="p-8 border-2 border-dashed border-gray-200 hover:border-primary rounded-2xl bg-gray-50/50 flex flex-col items-center text-center cursor-pointer transition-all group"><div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-all mb-3"><Upload className="w-6 h-6" /></div><p className="text-xs font-bold text-gray-900">Click to browse</p><p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM, audio, PDF up to 50MB</p></div>}
        {file && <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">{previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-gray-900 truncate">{file.name}</p><p className="text-[11px] text-gray-500 font-medium">{(file.size / 1024).toFixed(0)} KB • {file.type || 'Media File'}</p>{isUploading && <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2"><div style={{ width: `${uploadProgress}%` }} className="bg-primary h-full transition-all" /></div>}{isSuccess && <p className="text-[11px] font-semibold text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>Uploaded Successfully!</span></p>}{error && <p className="text-[11px] font-semibold text-red-600 mt-1">{error}</p>}</div>{!isUploading && !isSuccess && <button type="button" onClick={clearFile} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>}</div>}
        {!file && error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer">Cancel</button><button type="button" disabled={!file || isUploading || isSuccess} onClick={startUpload} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all disabled:opacity-50 cursor-pointer">{isUploading ? `Uploading (${uploadProgress}%)` : 'Start Upload'}</button></div>
      </div>
    </Modal>
  );
}

interface BulkMoveModalProps { isOpen: boolean; onClose: () => void; folders: MediaItem[]; selectedCount: number; onMove: (targetFolderId: string | null) => void; }
export function BulkMoveModal({ isOpen, onClose, folders, selectedCount, onMove }: BulkMoveModalProps) {
  const [targetId, setTargetId] = useState<string | null>(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<div className="flex items-center gap-2.5"><FolderInput className="w-5 h-5 text-primary" /><h3 className="text-lg font-bold text-gray-900">Move {selectedCount} Selected Items</h3></div>} maxWidth="md" bodyClassName="p-6 sm:p-8">
      <div className="space-y-5"><div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600">Select Destination Folder</label><select value={targetId || ''} onChange={(e) => setTargetId(e.target.value || null)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all cursor-pointer"><option value="">Root Media Library</option>{folders.filter(f => f.type === 'folder').map(folder => <option key={folder.id} value={folder.id}>📁 {folder.name}</option>)}</select></div><div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-all cursor-pointer">Cancel</button><button type="button" onClick={() => { onMove(targetId); onClose(); }} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-primary transition-all cursor-pointer">Move Items</button></div></div>
    </Modal>
  );
}
