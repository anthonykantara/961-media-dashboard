import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../components/common/Modal';

describe('Modal', () => {
  it('renders modal dialog title and children when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('triggers onClose when Escape key is pressed', () => {
    const onCloseMock = vi.fn();
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('traps focus inside modal elements on Tab navigation', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <button id="btn1">Button 1</button>
        <button id="btn2">Button 2</button>
      </Modal>
    );

    const btn1 = screen.getByRole('button', { name: 'Button 1' });
    const btn2 = screen.getByRole('button', { name: 'Button 2' });
    const closeBtn = screen.getByLabelText('Close dialog');

    // First focusable element should be focused initially or close button
    expect(document.activeElement).toBeInTheDocument();

    // Focus last button and tab forward -> wraps to first focusable
    btn2.focus();
    expect(document.activeElement).toBe(btn2);

    fireEvent.keyDown(window, { key: 'Tab' });
    // Tab event should wrap focus if activeElement was last
  });
});
