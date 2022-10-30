var LoginFailedReason;
(function (LoginFailedReason) {
    LoginFailedReason["WRONG_PASSWORD"] = "WRONG_PASSWORD";
    LoginFailedReason["DOESNT_EXIST"] = "DOESNT_EXIST";
})(LoginFailedReason || (LoginFailedReason = {}));
// TODO: TOO_LONG? need to ask on forum
var PasswordError;
(function (PasswordError) {
    PasswordError["TOO_SHORT"] = "Too short";
    PasswordError["NO_UPPERCASE"] = "No uppercase letter";
    PasswordError["NO_LOWERCASE"] = "No lowercase letter";
    PasswordError["NO_NUMBER"] = "No number";
    PasswordError["NO_SPECIAL_SYMBOL"] = "No special symbol";
})(PasswordError || (PasswordError = {}));
$(() => {
    $('#toggle-password').on('click', function (e) {
        const $password = $('#password');
        const showing = $password.prop('type') === 'text';
        $password.prop('type', showing ? 'password' : 'text');
        const $eye = $('#eye');
        $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
        $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    });
    $('#email, #password').on('input', function (e) {
        $(this).removeClass('is-invalid');
    });
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const credentials = Object.fromEntries(new FormData(this));
        if (!isValidWorkEmail(credentials.email)) {
            alert('Invalid email!');
            return;
        }
        const pwError = validatePassword(credentials.password);
        if (pwError) {
            passwordError(pwError);
            return;
        }
        login($this, credentials);
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
function passwordError(error) {
    // FIXME: this causes components to resize :/
    $('#password').addClass('is-invalid');
    $('#password-feedback').text(error);
}
function isValidWorkEmail(email) {
    return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}
const LOWERCASE_REGEX = /(?=.*[a-z])/;
const UPPERCASE_REGEX = /(?=.*[A-Z])/;
const NUMBER_REGEX = /(?=.*\d)/;
const SPECIAL_SYMBOL_REGEX = /(?=.*\W)/;
function validatePassword(password) {
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
// redirect with data: https://stackoverflow.com/a/10022098
function redirect(url, data) {
    const $form = $(`
  <form action="${url}" method="POST">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value="${value}" />`).join('')}
  </form>
  `);
    $('body').append($form);
    $form.trigger('submit');
}
function login($form, { email, password }) {
    $('#login-btn').prop('disabled', true);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        dataType: 'json',
    })
        .done((res) => {
        if (res.success) {
            redirect('todo/', { email });
        }
        else {
            console.log(res);
            switch (res.errorMessage) {
                case LoginFailedReason.DOESNT_EXIST:
                    $('#email').addClass('is-invalid');
                    break;
                case LoginFailedReason.WRONG_PASSWORD:
                    passwordError('Incorrect password!');
                    break;
                default:
                    $('#email').addClass('is-invalid');
                    passwordError(res.errorMessage);
            }
        }
    })
        .fail((xhr, errorTextStatus, errorMessage) => {
        alert(`${errorTextStatus}: ${errorMessage}`);
    })
        .always(() => {
        $('#login-btn').prop('disabled', false);
    });
}
export {};
