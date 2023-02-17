import type { UrlObject } from 'url';

/**
 * @note Chrome doesn't allow to copy from non-https (sci-project is http)
 *
 * @param content The text string to copy
 *
 * [Source](https://stackoverflow.com/a/65996386)
 */
export function copyToClipboard(content: string): Promise<void> {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method
    return navigator.clipboard.writeText(content);
  } else {
    // text area method
    const textArea = document.createElement('textarea');
    textArea.value = content;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

/**
 * Extracts the pathname from a `href`. See
 * [`NextLink`](https://nextjs.org/docs/api-reference/next/link)'s `href`
 *
 * @param href
 * @returns The pathname
 */
export function extractPathname(href: UrlObject | string): string {
  return typeof href === 'string' ? href : href.pathname!;
}

export function getInitials(name: string): string {
  // only show first 3 names
  // split by whitespace: https://stackoverflow.com/a/10346754
  const names = name.split(/[ ]+/, 3);
  const initials = names.map((name) => name[0].toLocaleUpperCase());

  return initials.join('');
}
