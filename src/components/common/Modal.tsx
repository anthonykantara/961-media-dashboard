import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'lg',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  headerClassName = '',
  bodyClassName = 'p-8',
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key closure
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    const getFocusableElements = (): HTMLElement[] => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusableEls = getFocusableElements();
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);

    return () => {
      window.removeEventListener('keydown', handleTabKey);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeOnBackdropClick && onClose()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${maxWidthClasses[maxWidth] || 'max-w-lg'} bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl my-auto ${className}`}
          >
            {(title || subtitle || icon) && (
              <div className={`p-8 border-b border-gray-50 flex items-center justify-between ${headerClassName}`}>
                <div className="flex items-center gap-4">
                  {icon && <div className="shrink-0">{icon}</div>}
                  <div>
                    {title && typeof title === 'string' ? (
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
                    ) : (
                      title
                    )}
                    {subtitle && typeof subtitle === 'string' ? (
                      <p className="text-sm text-gray-400 font-medium mt-1">{subtitle}</p>
                    ) : (
                      subtitle
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className={bodyClassName}>
              {children}
            </div>

            {footer && (
              <div className="px-8 pb-8 pt-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
