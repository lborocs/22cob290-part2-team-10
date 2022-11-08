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
// note: Chrome doesn't allow to copy from non-https (sci-project is http)
// https://stackoverflow.com/a/65996386
export function copyToClipboard(content) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method
        return navigator.clipboard.writeText(content);
    }
    else {
        // text area method
        const textArea = document.createElement("textarea");
        textArea.value = content;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
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
export function formIsInvalid($form) {
    return $form.find('.is-invalid').length > 0;
}
