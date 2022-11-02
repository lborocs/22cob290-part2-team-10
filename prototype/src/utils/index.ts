// redirect with data: https://stackoverflow.com/a/10022098
export function redirect(url: string, data: Record<string, string>) {
  const $form = $(`
  <form action="${url}" method="POST">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value="${value}" />`).join('')}
  </form>
  `);

  $('body').append($form);
  $form.trigger('submit');
}

export function isValidWorkEmail(email: string): boolean {
  return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}

// TODO: TOO_LONG? need to ask on forum
export enum PasswordError {
  TOO_SHORT = 'Too short',
  NO_UPPERCASE = 'No uppercase letter',
  NO_LOWERCASE = 'No lowercase letter',
  NO_NUMBER = 'No number',
  NO_SPECIAL_SYMBOL = 'No special symbol',
}

// https://stackoverflow.com/q/1559751
const LOWERCASE_REGEX = /(?=.*[a-z])/;
const UPPERCASE_REGEX = /(?=.*[A-Z])/;
const NUMBER_REGEX = /(?=.*\d)/;
const SPECIAL_SYMBOL_REGEX = /(?=.*\W)/;

export function validatePassword(password: string): PasswordError | null {
  if (password.length < 12)
    return PasswordError.TOO_SHORT;

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
