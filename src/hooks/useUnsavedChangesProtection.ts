import { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';

export function useUnsavedChangesProtection(isDirtyInput: boolean | (() => boolean)) {
  const isDirtyFn = typeof isDirtyInput === 'function' ? isDirtyInput : () => isDirtyInput;
  const isDirty = isDirtyFn();

  // 1. Native beforeunload event listener for browser tab close/reload
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // 2. React Router v7 blocker for in-app navigation
  let blocker: ReturnType<typeof useBlocker>;
  try {
    blocker = useBlocker(
      useCallback(
        ({ currentLocation, nextLocation }) => {
          if (!isDirtyFn()) return false;
          return (
            currentLocation.pathname !== nextLocation.pathname ||
            currentLocation.search !== nextLocation.search ||
            currentLocation.hash !== nextLocation.hash
          );
        },
        [isDirtyFn]
      )
    );
  } catch {
    // Fallback if rendered outside a Data Router context in unit tests
    blocker = {
      state: 'unblocked',
      proceed: () => {},
      reset: () => {},
      location: undefined,
    } as any;
  }

  const showModal = blocker.state === 'blocked';

  const handleConfirm = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker]);

  const handleCancel = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  }, [blocker]);

  return {
    showModal,
    handleConfirm,
    handleCancel,
    blocker,
  };
}

export default useUnsavedChangesProtection;
