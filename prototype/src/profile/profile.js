import '../utils/redirect';
import { copyToClipboard, formIsInvalid, validatePassword } from '../utils';
// hardcoded, will have to get from backend I think
function generateInviteToken() {
    return 'a-token';
}
$(() => {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('.multiline-tooltip').tooltip({ html: true });
    $('.toggle-password-btn').on('click', function (e) {
        const $this = $(this);
        const $pwField = $this.parent().find('input');
        const showing = $pwField.prop('type') === 'text';
        $pwField.prop('type', showing ? 'password' : 'text');
        const $eye = $this.find('.eye');
        $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
        $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    });
    $('input[autocomplete*="password"]').on('input', function (e) {
        $(this).removeClass('is-invalid');
    });
    $('#change-pw-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const formData = Object.fromEntries(new FormData(this));
        const { email, current, newPassword, confirm } = formData;
        let pwError = validatePassword(current);
        if (pwError) {
            passwordError(pwError, 'current');
        }
        pwError = validatePassword(newPassword);
        if (pwError) {
            passwordError(pwError, 'newPassword');
        }
        if (newPassword !== confirm) {
            passwordError('Passwords do not match!', 'confirm');
        }
        if (formIsInvalid($this))
            return;
        // TODO: make ajax request, if successful: & show toast saying it was successful (BS 4.3+ - will need to upgrade)
        // https://getbootstrap.com/docs/4.3/components/toasts/
        $('#change-pw-modal').modal('hide');
    });
    $('#invite').on('click', function (e) {
        const $inviteInput = $('#invite-url').removeClass('is-valid');
        const token = generateInviteToken();
        const url = `http://team10.sci-project.lboro.ac.uk/signup?token=${token}`;
        $inviteInput.attr('value', url);
        $('#invite-modal').modal('show');
    });
    $('#copy-invite-url').on('click', function (e) {
        const $inviteInput = $('#invite-url');
        const url = $inviteInput.attr('value');
        copyToClipboard(url)
            .then(() => $inviteInput.addClass('is-valid'))
            .catch((reason) => {
            $inviteInput.addClass('is-invalid');
            $('#copy-failed').text(reason);
        });
    });
});
function passwordError(error, id) {
    $(`#${id}`).addClass('is-invalid');
    $(`#${id}-feedback`).text(error);
}
