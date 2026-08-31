import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CreatePostPage from '../components/dashboard/posts/CreatePostPage';
import CreateListiclePage from '../components/dashboard/posts/CreateListiclePage';
import CreateExpressPage from '../components/dashboard/posts/CreateExpressPage';
import { PostProvider } from '../components/dashboard/posts/PostContext';
import { TeamProvider } from '../components/dashboard/team/TeamContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <TeamProvider>
        <PostProvider>
          {ui}
        </PostProvider>
      </TeamProvider>
    </MemoryRouter>
  );
}

describe('Sanitization Integration in Editor Suites', () => {
  it('sanitizes paste in CreatePostPage contentEditable container', async () => {
    const { container } = renderWithProviders(<CreatePostPage />);
    const editor = container.querySelector('[contenteditable="true"]');
    expect(editor).not.toBeNull();

    const dirtyHtml = '<p style="font-family: Arial; color: red;">Hello <strong style="font-size: 18px;">World</strong></p>';
    const clipboardData = {
      getData: (type: string) => (type === 'text/html' ? dirtyHtml : 'Hello World')
    };

    fireEvent.paste(editor!, { clipboardData });

    expect(editor!.innerHTML).not.toContain('style=');
    expect(editor!.innerHTML).not.toContain('font-family');
    expect(editor!.innerHTML).toContain('Hello');
    expect(editor!.innerHTML).toContain('<strong>World</strong>');
  });

  it('sanitizes paste in CreateListiclePage intro contentEditable container', async () => {
    const { container } = renderWithProviders(<CreateListiclePage />);
    const editor = container.querySelector('[contenteditable="true"]');
    expect(editor).not.toBeNull();

    const dirtyHtml = '<div style="background-color: yellow;"><a href="https://the961.com" style="color: blue;">961 Link</a></div>';
    const clipboardData = {
      getData: (type: string) => (type === 'text/html' ? dirtyHtml : '961 Link')
    };

    fireEvent.paste(editor!, { clipboardData });

    expect(editor!.innerHTML).not.toContain('style=');
    expect(editor!.innerHTML).not.toContain('background-color');
    expect(editor!.innerHTML).toContain('<a href="https://the961.com">961 Link</a>');
  });

  it('sanitizes paste in CreateExpressPage setup modal and main editor', async () => {
    const { container } = renderWithProviders(<CreateExpressPage />);
    const textarea = container.querySelector('textarea[placeholder*="Paste rough notes"]') as HTMLTextAreaElement;
    expect(textarea).not.toBeNull();

    const dirtyHtml = '<span style="font-family: Times; color: green;">Setup modal notes from Word</span>';
    const clipboardData = {
      getData: (type: string) => (type === 'text/html' ? dirtyHtml : 'Setup modal notes from Word')
    };

    fireEvent.paste(textarea, { clipboardData });

    await waitFor(() => {
      expect(textarea.value).toContain('Setup modal notes from Word');
    });
    expect(textarea.value).not.toContain('style=');
    expect(textarea.value).not.toContain('font-family');
  });
});
