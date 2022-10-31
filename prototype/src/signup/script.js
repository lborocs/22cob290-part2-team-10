import { redirect, isValidWorkEmail, validatePassword } from '../utils';
var SignupFailedReason;
(function (SignupFailedReason) {
    SignupFailedReason["ALREADY_EXIST"] = "ALREADY_EXIST";
    SignupFailedReason["INVALID_TOKEN"] = "INVALID_TOKEN";
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
        const $confirm = $('#confirm');
        const showing = $confirm.prop('type') === 'text';
        $confirm.prop('type', showing ? 'password' : 'text');
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
        if (credentials.password !== credentials.confirm) {
            passwordError('Passwords do not match!', 'confirm');
            return;
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
// hardcoded
function getToken() {
    var _a;
    const url = new URL(window.location.href);
    return (_a = url.searchParams.get('token')) !== null && _a !== void 0 ? _a : 'bad-token';
}
function signup($form, { email, password }) {
    $('#signup-btn').prop('disabled', true);
    const token = getToken();
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: { email, password, token },
        dataType: 'json',
    })
        .done((res) => {
        if (res.success) {
            redirect('todo', { email });
        }
        else {
            console.log(res);
            switch (res.errorMessage) {
                case SignupFailedReason.ALREADY_EXIST:
                    $('#email').addClass('is-invalid');
                    break;
                case SignupFailedReason.INVALID_TOKEN:
                    alert('Invalid token!');
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
