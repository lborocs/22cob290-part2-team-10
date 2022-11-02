import { redirect, isValidWorkEmail, validatePassword } from '../utils';
var SignupFailedReason;
(function (SignupFailedReason) {
    SignupFailedReason["ALREADY_EXIST"] = "ALREADY_EXIST";
    SignupFailedReason["INVALID_TOKEN"] = "INVALID_TOKEN";
    SignupFailedReason["USED_TOKEN"] = "USED_TOKEN";
})(SignupFailedReason || (SignupFailedReason = {}));
$(() => {
    $('#toggle-password').on('click', function (e) {
        const $password = $('#password');
        const showing = $password.prop('type') === 'text';
        $password.prop('type', showing ? 'password' : 'text');
        const $eye = $('#eye');
        $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
        $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    });
    $('#toggle-confirm').on('click', function (e) {
        const $confirm = $('#confirm');
        const showing = $confirm.prop('type') === 'text';
        $confirm.prop('type', showing ? 'password' : 'text');
        const $eye = $('#confirm-eye');
        $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
        $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    });
    $('#token, #email, #password, #confirm').on('input', function (e) {
        $(this).removeClass('is-invalid');
    });
    $('#signup-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const credentials = Object.fromEntries(new FormData(this));
        // TODO: may need to check database of employees (from client)
        if (!isValidWorkEmail(credentials.email)) {
            emailError('Invalid Make-It-All email!');
        }
        const pwError = validatePassword(credentials.password);
        if (pwError) {
            passwordError(pwError);
        }
        if (credentials.password !== credentials.confirm) {
            passwordError('Passwords do not match!', 'confirm');
        }
        if (formIsInvalid($this))
            return;
        signup($this, credentials);
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
function signup($form, { token, email, password }) {
    $('#signup-btn').prop('disabled', true);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: { token, email, password },
        dataType: 'json',
    })
        .done((res) => {
        if (res.success) {
            redirect('home', { email });
        }
        else {
            console.log(res);
            switch (res.errorMessage) {
                case SignupFailedReason.ALREADY_EXIST:
                    emailError('You already have an account!');
                    break;
                case SignupFailedReason.INVALID_TOKEN:
                    tokenError('Your invite token is invalid!');
                    break;
                case SignupFailedReason.USED_TOKEN:
                    tokenError('Your invite token has already been used!');
                    break;
                default:
            }
        }
    })
        .fail((xhr, errorTextStatus, errorMessage) => {
        alert(`${errorTextStatus}: ${errorMessage}`);
    })
        .always(() => {
        $('#signup-btn').prop('disabled', false);
    });
}
function formIsInvalid($form) {
    return $form.find('.is-invalid').length > 0;
}
function emailError(error) {
    $('#email').addClass('is-invalid');
    $('#email-feedback').text(error);
}
function passwordError(error, id = 'password') {
    $(`#${id}`).addClass('is-invalid');
    $(`#${id}-feedback`).text(error);
}
function tokenError(error) {
    $('#token').addClass('is-invalid');
    $('#token-feedback').text(error);
}
