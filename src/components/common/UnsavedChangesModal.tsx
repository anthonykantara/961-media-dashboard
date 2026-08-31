import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function UnsavedChangesModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Unsaved Changes',
  description = 'You have unsaved changes in your editor draft. Leaving this page will discard all unsaved edits.',
  confirmText = 'Discard Changes',
  cancelText = 'Stay on Page',
}: UnsavedChangesModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      subtitle="Action required"
      icon={
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
      }
      maxWidth="md"
      closeOnBackdropClick={false}
      closeOnEscape={true}
      footer={
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
    </Modal>
  );
}

export default UnsavedChangesModal;
