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
export const LOWERCASE_REGEX = /(?=.*[a-z])/;
export const UPPERCASE_REGEX = /(?=.*[A-Z])/;
export const NUMBER_REGEX = /(?=.*\d)/;
export const SPECIAL_SYMBOL_REGEX = /(?=.*\W)/;

/* eslint-disable nonblock-statement-body-position */
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

// note: Chrome doesn't allow to copy from non-https (sci-project is http)
// https://stackoverflow.com/a/65996386
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

export type TextAvatar = {
  'avatar-bg': string
  'avatar-fg': string
};

// TODO: move this into template code
export function getTextAvatarFromLocalStorage(): TextAvatar | null {
  const textAvatarJson = localStorage.getItem('textAvatar');

  if (textAvatarJson == null) return null;

  const textAvatar = JSON.parse(textAvatarJson) as TextAvatar;

  for (const key in textAvatar) {
    const colour = textAvatar[<keyof TextAvatar>key];

    document.documentElement.style.setProperty(`--${key}`, colour);
  }

  return textAvatar;
}
