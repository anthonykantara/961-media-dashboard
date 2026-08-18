import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useModal } from '../hooks/useModal';

describe('useModal', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('opens and closes modal with data', () => {
    const { result } = renderHook(() => useModal<{ id: string }>());

    act(() => {
      result.current.openModal({ id: 'item-1' });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual({ id: 'item-1' });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggles visibility state', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.toggleModal();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleModal();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
