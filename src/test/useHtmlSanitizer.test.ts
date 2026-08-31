import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { sanitizeHtml, sanitizeText } from '../utils/sanitizeHtml';
import { useHtmlSanitizer } from '../hooks/useHtmlSanitizer';

describe('sanitizeHtml Utility', () => {
  it('strips all inline styles and custom font overrides while preserving bold, italic, links, and lists', () => {
    const dirtyHtml = `
      <p style="font-family: Arial, sans-serif; color: red; font-size: 16px;">
        This is <strong style="color: blue;">bold</strong> text and 
        <em style="background: yellow;">italic</em> text with a 
        <a href="https://the961.com" style="text-decoration: none;">clean link</a>.
      </p>
      <ul style="list-style: none;">
        <li style="font-family: Times;">List item 1</li>
        <li>List item 2</li>
      </ul>
    `;

    const cleanHtml = sanitizeHtml(dirtyHtml);

    // Expect no style attributes
    expect(cleanHtml).not.toContain('style=');
    expect(cleanHtml).not.toContain('font-family');
    expect(cleanHtml).not.toContain('color:');

    // Expect semantic tags preserved
    expect(cleanHtml).toContain('<p>');
    expect(cleanHtml).toContain('<strong>bold</strong>');
    expect(cleanHtml).toContain('<em>italic</em>');
    expect(cleanHtml).toContain('<a href="https://the961.com">clean link</a>');
    expect(cleanHtml).toContain('<ul>');
    expect(cleanHtml).toContain('<li>List item 1</li>');
  });

  it('unwraps foreign tags like <font> and <o:p> from Microsoft Word pasted payloads', () => {
    const wordHtml = `
      <p class="MsoNormal" style="mso-margin-top-alt:auto;">
        <font face="Calibri" color="#333333">
          Word content <o:p>with proprietary tags</o:p>
        </font>
      </p>
    `;

    const cleanHtml = sanitizeHtml(wordHtml);

    expect(cleanHtml).not.toContain('class=');
    expect(cleanHtml).not.toContain('<font');
    expect(cleanHtml).not.toContain('<o:p');
    expect(cleanHtml).toContain('<p>');
    expect(cleanHtml).toContain('Word content with proprietary tags');
  });

  it('strips dangerous script tags and malicious javascript: links', () => {
    const dangerousHtml = `
      <p>Safe content</p>
      <script>alert("xss")</script>
      <a href="javascript:alert(1)">Click me</a>
    `;

    const cleanHtml = sanitizeHtml(dangerousHtml);

    expect(cleanHtml).not.toContain('<script');
    expect(cleanHtml).not.toContain('alert');
    expect(cleanHtml).not.toContain('href=');
    expect(cleanHtml).toContain('<p>Safe content</p>');
    expect(cleanHtml).toContain('Click me');
  });

  it('strips obfuscated javascript links and dangerous data URLs on <a> tags', () => {
    const dangerousHtml = `
      <a href="  java\nscript:alert(1)">Obfuscated JS</a>
      <a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Data URL</a>
      <a href="https://the961.com" target="_blank">Valid External Link</a>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Tiny image" />
    `;

    const cleanHtml = sanitizeHtml(dangerousHtml);

    expect(cleanHtml).not.toContain('java');
    expect(cleanHtml).not.toContain('data:text/html');
    expect(cleanHtml).toContain('<a href="https://the961.com" target="_blank" rel="noopener noreferrer">Valid External Link</a>');
    expect(cleanHtml).toContain('<img src="data:image/png;base64,');
  });

  it('strips empty inline tags after cleaning', () => {
    const htmlWithEmptyTags = `
      <p>Text <strong></strong> and <em></em> <span></span> with <a href="javascript:void(0)">empty link</a></p>
    `;

    const cleanHtml = sanitizeHtml(htmlWithEmptyTags);

    expect(cleanHtml).not.toContain('<strong></strong>');
    expect(cleanHtml).not.toContain('<em></em>');
    expect(cleanHtml).not.toContain('<span></span>');
    expect(cleanHtml).toContain('<p>Text  and   with empty link</p>');
  });
});

describe('useHtmlSanitizer Hook', () => {
  it('handles paste event on contentEditable element and calls onContentChange with sanitized HTML', () => {
    const onContentChange = vi.fn();
    const container = document.createElement('div');
    container.contentEditable = 'true';
    document.body.appendChild(container);

    const editorRef = { current: container };
    const { result } = renderHook(() => useHtmlSanitizer({ editorRef, onContentChange }));

    const dirtyClipboardHtml = '<p style="color: red; font-family: Courier;">Pasted <strong>formatted</strong> content</p>';

    const fakeClipboardData = {
      getData: (type: string) => {
        if (type === 'text/html') return dirtyClipboardHtml;
        if (type === 'text/plain') return 'Pasted formatted content';
        return '';
      }
    };

    const preventDefault = vi.fn();
    const event = {
      preventDefault,
      clipboardData: fakeClipboardData,
      currentTarget: container
    } as unknown as React.ClipboardEvent<HTMLElement>;

    act(() => {
      result.current.handlePaste(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(onContentChange).toHaveBeenCalledWith('<p>Pasted <strong>formatted</strong> content</p>');
    expect(container.innerHTML).toBe('<p>Pasted <strong>formatted</strong> content</p>');

    document.body.removeChild(container);
  });

  it('handles paste event on textarea element in setup modal and extracts clean text', () => {
    const onContentChange = vi.fn();
    const textarea = document.createElement('textarea');
    textarea.value = 'Existing ';
    textarea.selectionStart = 9;
    textarea.selectionEnd = 9;
    document.body.appendChild(textarea);

    const { result } = renderHook(() => useHtmlSanitizer({ onContentChange }));

    const dirtyClipboardHtml = '<span style="font-family: Arial; color: blue;">Pasted notes from Word</span>';

    const fakeClipboardData = {
      getData: (type: string) => {
        if (type === 'text/html') return dirtyClipboardHtml;
        if (type === 'text/plain') return 'Pasted notes from Word';
        return '';
      }
    };

    const preventDefault = vi.fn();
    const event = {
      preventDefault,
      clipboardData: fakeClipboardData,
      currentTarget: textarea
    } as unknown as React.ClipboardEvent<HTMLElement>;

    act(() => {
      result.current.handlePaste(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(textarea.value).toBe('Existing Pasted notes from Word');
    expect(onContentChange).toHaveBeenCalledWith('Existing Pasted notes from Word');

    document.body.removeChild(textarea);
  });
});
