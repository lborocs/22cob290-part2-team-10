import { redirect, isValidWorkEmail, validatePassword } from '../utils';
var SignupFailedReason;
(function (SignupFailedReason) {
    SignupFailedReason["ALREADY_EXIST"] = "ALREADY_EXIST";
})(SignupFailedReason || (SignupFailedReason = {}));
// TODO: maybe change input error to tooltips because of spacing
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
        const $password = $('#confirm');
        const showing = $password.prop('type') === 'text';
        $password.prop('type', showing ? 'password' : 'text');
        const $eye = $('#confirm-eye');
        $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
        $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    });
    $('#email, #password, #confirm').on('input', function (e) {
        $(this).removeClass('is-invalid');
    });
    $('#signup-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const credentials = Object.fromEntries(new FormData(this));
        if (!isValidWorkEmail(credentials.email)) {
            alert('Invalid email!');
            return;
        }
        let pwError = validatePassword(credentials.password);
        if (pwError) {
            passwordError(pwError);
            return;
        }
        pwError = validatePassword(credentials.confirm);
        if (pwError) {
            passwordError(pwError, 'confirm');
            return;
        }
        if (credentials.password !== credentials.confirm) {
            passwordError('');
            passwordError('Passwords do not match!', 'confirm');
        }
        signup($this, credentials);
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
function passwordError(error, id = 'password') {
    // FIXME: this causes components to resize :/
    $(`#${id}`).addClass('is-invalid');
    $(`#${id}-feedback`).text(error);
}
function signup($form, { email, password }) {
    $('#signup-btn').prop('disabled', true);
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
        }
    })
        .fail((xhr, errorTextStatus, errorMessage) => {
        alert(`${errorTextStatus}: ${errorMessage}`);
    })
        .always(() => {
        $('#signup-btn').prop('disabled', false);
    });
}
