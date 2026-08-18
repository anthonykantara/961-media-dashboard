import React, { useState, useCallback } from 'react';

export interface UseModalOptions<T = any> {
  initialOpen?: boolean;
  initialData?: T | null;
  initialStep?: number | string;
}

export interface UseModalReturn<T = any> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  step: number | string;
  setStep: React.Dispatch<React.SetStateAction<number | string>>;
  openModal: (modalData?: T | null) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export function useModal<T = any>(options: UseModalOptions<T> = {}): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(options.initialOpen || false);
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [step, setStep] = useState<number | string>(options.initialStep || 0);

  const openModal = useCallback((modalData?: T | null) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    setIsOpen,
    data,
    setData,
    step,
    setStep,
    openModal,
    closeModal,
    toggleModal,
  };
}
