import { useCallback, RefObject } from 'react';
import { sanitizeHtml, sanitizeText } from '../utils/sanitizeHtml';

export interface UseHtmlSanitizerOptions {
  /**
   * Optional ref to the target contentEditable element or input element.
   */
  editorRef?: RefObject<HTMLElement | null>;
  /**
   * Callback called whenever content is updated via paste.
   * Receives the updated container innerHTML (or input value).
   */
  onContentChange?: (content: string) => void;
}

/**
 * Custom React hook for DOMParser-based HTML sanitization on paste events.
 * Preserves semantic markup, removes inline styles and foreign font attributes,
 * and maintains cursor positioning via native Range API.
 */
export function useHtmlSanitizer(options: UseHtmlSanitizerOptions = {}) {
  const { editorRef, onContentChange } = options;

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();

    const targetElement = (editorRef?.current || e.currentTarget) as HTMLElement;
    const isInputOrTextArea =
      targetElement instanceof HTMLInputElement ||
      targetElement instanceof HTMLTextAreaElement;

    const clipboardHtml = e.clipboardData.getData('text/html');
    const clipboardText = e.clipboardData.getData('text/plain');

    if (isInputOrTextArea) {
      const inputEl = targetElement as HTMLInputElement | HTMLTextAreaElement;
      let cleanedText = '';

      if (clipboardHtml) {
        const sanitizedHtml = sanitizeHtml(clipboardHtml);
        const temp = document.createElement('div');
        temp.innerHTML = sanitizedHtml;
        cleanedText = temp.textContent || temp.innerText || '';
      } else {
        cleanedText = clipboardText || '';
      }

      const start = inputEl.selectionStart ?? inputEl.value.length;
      const end = inputEl.selectionEnd ?? inputEl.value.length;
      const currentValue = inputEl.value;

      const newValue = currentValue.slice(0, start) + cleanedText + currentValue.slice(end);
      inputEl.value = newValue;
      inputEl.selectionStart = inputEl.selectionEnd = start + cleanedText.length;

      const event = new Event('input', { bubbles: true });
      inputEl.dispatchEvent(event);

      if (onContentChange) {
        onContentChange(newValue);
      }
      return;
    }

    // ContentEditable handling
    let htmlToInsert = '';
    if (clipboardHtml) {
      htmlToInsert = sanitizeHtml(clipboardHtml);
    }

    if (!htmlToInsert && clipboardText) {
      htmlToInsert = sanitizeText(clipboardText).replace(/\n/g, '<br>');
    }

    if (!htmlToInsert) return;

    targetElement.focus();

    const selection = window.getSelection();
    let inserted = false;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (targetElement.contains(range.commonAncestorContainer)) {
        range.deleteContents();

        const template = document.createElement('template');
        template.innerHTML = htmlToInsert;
        const fragment = template.content;
        const lastChild = fragment.lastChild;

        range.insertNode(fragment);

        if (lastChild) {
          const newRange = document.createRange();
          newRange.setStartAfter(lastChild);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        inserted = true;
      }
    }

    if (!inserted) {
      targetElement.innerHTML += htmlToInsert;
    }

    const updatedHtml = targetElement.innerHTML;
    if (onContentChange) {
      onContentChange(updatedHtml);
    }
  }, [editorRef, onContentChange]);

  return {
    sanitizeHtml,
    sanitizeText,
    handlePaste
  };
}
