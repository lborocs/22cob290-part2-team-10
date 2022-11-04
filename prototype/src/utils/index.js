// redirect with data: https://stackoverflow.com/a/10022098
export function redirect(url, data) {
    const $form = $(`
  <form action="${url}" method="POST">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value="${value}" />`).join('')}
  </form>
  `);
    $('body').append($form);
    $form.trigger('submit');
}
export function isValidWorkEmail(email) {
    return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}
export var PasswordError;
(function (PasswordError) {
    PasswordError["TOO_SHORT"] = "Too short";
    PasswordError["TOO_LONG"] = "Too long";
    PasswordError["NO_UPPERCASE"] = "No uppercase letter";
    PasswordError["NO_LOWERCASE"] = "No lowercase letter";
    PasswordError["NO_NUMBER"] = "No number";
    PasswordError["NO_SPECIAL_SYMBOL"] = "No special symbol";
})(PasswordError || (PasswordError = {}));
// https://stackoverflow.com/q/1559751
const LOWERCASE_REGEX = /(?=.*[a-z])/;
const UPPERCASE_REGEX = /(?=.*[A-Z])/;
const NUMBER_REGEX = /(?=.*\d)/;
const SPECIAL_SYMBOL_REGEX = /(?=.*\W)/;
export function validatePassword(password) {
    if (password.length < 12)
        return PasswordError.TOO_SHORT;
    if (password.length > 64)
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
