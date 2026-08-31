/**
 * DOMParser-based HTML sanitization engine for 961 Media post editors.
 * Strips inline styles, custom fonts, foreign markup, and non-whitelisted attributes
 * while preserving semantic rich text formatting (strong, em, a, ul, ol, li, etc.).
 */

const ALLOWED_TAGS = new Set([
  'STRONG', 'B',
  'EM', 'I',
  'U', 'S', 'STRIKE', 'DEL', 'SUB', 'SUP',
  'CODE', 'PRE',
  'A',
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'BLOCKQUOTE', 'DIV', 'HR', 'BR',
  'UL', 'OL', 'LI',
  'SPAN', 'IMG', 'IFRAME'
]);

const DANGEROUS_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'OBJECT', 'EMBED',
  'APPLET', 'META', 'LINK', 'TITLE', 'HEAD', 'SVG'
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  'A': new Set(['href', 'target', 'rel', 'title']),
  'IMG': new Set(['src', 'alt', 'title', 'width', 'height']),
  'IFRAME': new Set(['src', 'title', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'])
};

/**
 * Validates URLs for a / img / iframe tags to prevent dangerous protocols.
 */
function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:text/html') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  return true;
}

/**
 * Cleans a DOM node recursively according to allowlist rules.
 */
function cleanNode(node: Node): void {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.COMMENT_NODE) {
      node.removeChild(child);
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tagName = el.tagName.toUpperCase();

      if (DANGEROUS_TAGS.has(tagName)) {
        node.removeChild(el);
        continue;
      }

      // Clean children recursively first
      cleanNode(el);

      if (ALLOWED_TAGS.has(tagName)) {
        const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || new Set();
        const attrs = Array.from(el.attributes);

        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();
          if (allowedAttrs.has(attrName)) {
            if ((attrName === 'href' || attrName === 'src') && !isSafeUrl(attr.value)) {
              el.removeAttribute(attr.name);
            }
          } else {
            // Remove style, class, id, font-family, and all non-whitelisted attributes
            el.removeAttribute(attr.name);
          }
        }

        // Unwrap SPAN tags that have no remaining attributes
        if (tagName === 'SPAN' && el.attributes.length === 0) {
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          node.removeChild(el);
        }
      } else {
        // Non-whitelisted tag (e.g., <font>, <o:p>, <xml>, <center>, etc.): unwrap its children
        while (el.firstChild) {
          node.insertBefore(el.firstChild, el);
        }
        node.removeChild(el);
      }
    }
  }
}

/**
 * Sanitizes input HTML string using DOMParser and semantic allowlist rules.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  cleanNode(doc.body);

  return doc.body.innerHTML;
}

/**
 * Sanitizes plain text input by escaping HTML special characters, or converting
 * newlines into clean paragraph/line-break structures if needed.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
