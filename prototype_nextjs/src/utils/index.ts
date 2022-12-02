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
 * @param start The start number (inclusive)
 * @param end The end number (inclusive)
 * @returns List of numbers from `start` to `end`
 *
 * [Source](https://stackoverflow.com/a/38213213)
 */
export function range(start: number, end: number): number[] {
  return [...Array(end).keys()].map((i) => i + start);
}
