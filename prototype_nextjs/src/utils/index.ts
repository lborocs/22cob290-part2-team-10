import * as yup from 'yup';

export function isValidMakeItAllEmail(email: string): boolean {
  return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}

export enum PasswordError {
  TOO_SHORT = 'Too short',
  TOO_LONG = 'Too long',
  NO_UPPERCASE = 'No uppercase letter',
  NO_LOWERCASE = 'No lowercase letter',
  NO_NUMBER = 'No number',
  NO_SPECIAL_SYMBOL = 'No special symbol',
}

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 64;

// https://stackoverflow.com/q/1559751
export const LOWERCASE_REGEX = /(.*[a-z])/;
export const UPPERCASE_REGEX = /(.*[A-Z])/;
export const NUMBER_REGEX = /(.*\d)/;
export const SPECIAL_SYMBOL_REGEX = /(.*\W)/;

/* eslint-disable nonblock-statement-body-position */
/**
 * Checks that the provided password conforms to the password policy.
 *
 * @param password
 * @return The error reason (`PasswordError`), or `null` if the password is valid
 */
export function validatePassword(password: string): PasswordError | null {
  if (password.length < MIN_PASSWORD_LENGTH)
    return PasswordError.TOO_SHORT;

  if (password.length > MAX_PASSWORD_LENGTH)
    return PasswordError.TOO_LONG;

  if (!LOWERCASE_REGEX.test(password))
    return PasswordError.NO_LOWERCASE;

  if (!UPPERCASE_REGEX.test(password))
    return PasswordError.NO_UPPERCASE;

  if (!NUMBER_REGEX.test(password))
    return PasswordError.NO_NUMBER;

  if (!SPECIAL_SYMBOL_REGEX.test(password))
    return PasswordError.NO_SPECIAL_SYMBOL;

  return null;
}
/* eslint-enable nonblock-statement-body-position */

export const PASSWORD_SCHEMA = yup.string()
  .min(MIN_PASSWORD_LENGTH)
  .max(MAX_PASSWORD_LENGTH)
  .matches(LOWERCASE_REGEX)
  .matches(UPPERCASE_REGEX)
  .matches(NUMBER_REGEX)
  .matches(SPECIAL_SYMBOL_REGEX)
  ;

/**
 * @note Chrome doesn't allow to copy from non-https (sci-project is http)
 *
 * @param content The text string to copy
 *
 * [Stack Overflow](https://stackoverflow.com/a/65996386)
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
 * @param end The end number (exclusive)
 * @returns list of numbers from `start` to `end`
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: (end - start) }, (v, k) => k + start);
}
