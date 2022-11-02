import { redirect, isValidWorkEmail, validatePassword } from '../utils';
var LoginFailedReason;
(function (LoginFailedReason) {
    LoginFailedReason["WRONG_PASSWORD"] = "WRONG_PASSWORD";
    LoginFailedReason["DOESNT_EXIST"] = "DOESNT_EXIST";
})(LoginFailedReason || (LoginFailedReason = {}));
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
        if (!isValidWorkEmail(credentials.email))
            emailError('Invalid Make-It-All email');
        const pwError = validatePassword(credentials.password);
        if (pwError)
            passwordError(pwError);
        if (formIsInvalid($this))
            return;
        login($this, credentials);
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
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
            redirect('todo', { email });
        }
        else {
            console.log(res);
            switch (res.errorMessage) {
                case LoginFailedReason.DOESNT_EXIST:
                    emailError('You do not have an account');
                    break;
                case LoginFailedReason.WRONG_PASSWORD:
                    passwordError('Incorrect password');
                    break;
                default: // shouldn't happen
                    emailError('');
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
function formIsInvalid($form) {
    return $form.find('.is-invalid').length > 0;
}
function emailError(error) {
    $('#email').addClass('is-invalid');
    $('#email-feedback').text(error);
}
function passwordError(error) {
    // FIXME: this causes components to resize :/
    $('#password').addClass('is-invalid');
    $('#password-feedback').text(error);
}
