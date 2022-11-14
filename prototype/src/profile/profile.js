import { copyToClipboard, formIsInvalid, validatePassword } from '../utils';
import redirect from '../utils/redirect';
var ChangePwFailedReason;
(function (ChangePwFailedReason) {
    ChangePwFailedReason["WRONG_PASSWORD"] = "WRONG_PASSWORD";
})(ChangePwFailedReason || (ChangePwFailedReason = {}));
$(() => {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    getTextAvatarFromLocalStorage();
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
        const { currentPassword, newPassword, confirm } = formData;
        let pwError = validatePassword(currentPassword);
        if (pwError) {
            passwordError(pwError, 'currentPassword');
        }
        pwError = validatePassword(newPassword);
        if (pwError) {
            passwordError(pwError, 'newPassword');
        }
        else if (currentPassword === newPassword) {
            passwordError('Use a new password!', 'newPassword');
        }
        if (newPassword !== confirm) {
            passwordError('Passwords do not match!', 'confirm');
        }
        if (formIsInvalid($this))
            return;
        changePassword($this, formData);
    });
    $('#invite-modal').on('show.bs.modal', async function (e) {
        const $inviteInput = $('#invite-url')
            .removeClass('is-valid')
            .removeClass('is-invalid');
        const token = await getInviteToken();
        const url = `http://team10.sci-project.lboro.ac.uk/signup?token=${token}`;
        $inviteInput.attr('value', url);
    });
    $('#copy-invite-url').on('click', function (e) {
        const $inviteInput = $('#invite-url');
        const url = $inviteInput.attr('value');
        copyToClipboard(url)
            .then(() => $inviteInput.addClass('is-valid'))
            .catch((reason = 'Copy failed.') => {
            $inviteInput.addClass('is-invalid');
            $('#copy-failed').text(reason);
        });
    });
    $('#log-out-btn').on('click', async function (e) {
        await fetch('profile/logout.php'); // deletes credential cookie
        redirect('/');
    });
    $('#text-avatar-form input[type="color"]').on('input', function (e) {
        const $this = $(this);
        const id = this.id;
        const colour = $this.val();
        console.log(`--${id} == ${$this.val()}`);
        $(':root').css({
            [`--${id}`]: colour,
        });
    });
    $('#avatar-modal').on('hidden.bs.modal', async function (e) {
        getTextAvatarFromLocalStorage();
    });
    $('#text-avatar-form').on('submit', function (e) {
        e.preventDefault();
        const textAvatar = Object.fromEntries(new FormData(this));
        localStorage.setItem('textAvatar', JSON.stringify(textAvatar));
    });
});
function passwordError(error, id) {
    $(`#${id}`).addClass('is-invalid');
    $(`#${id}-feedback`).text(error);
}
function changePassword($form, { currentPassword, newPassword }) {
    const $submitBtn = $(`button[form=${$form.attr('id')}]`).prop('disabled', true);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: { currentPassword, newPassword },
        dataType: 'json',
    })
        .done((res) => {
        if (res.success) {
            $('#change-pw-modal').modal('hide');
            $('#pw-changed-toast').toast('show');
        }
        else {
            switch (res.errorMessage) {
                case ChangePwFailedReason.WRONG_PASSWORD:
                    passwordError('Incorrect password', 'currentPassword');
                    break;
                default: // shouldn't happen
                    passwordError(res.errorMessage, 'currentPassword');
            }
        }
    })
        .fail((xhr, errorTextStatus, errorMessage) => {
        alert(`${errorTextStatus}: ${errorMessage}`);
    })
        .always(() => {
        $submitBtn.prop('disabled', false);
    });
}
async function getInviteToken() {
    const resp = await fetch('profile/generate_invite.php');
    const res = await resp.json();
    return res.token;
}
// TODO: move this into template code
function getTextAvatarFromLocalStorage() {
    const textAvatarJson = localStorage.getItem('textAvatar');
    if (textAvatarJson == null)
        return;
    const textAvatar = JSON.parse(textAvatarJson);
    for (const key in textAvatar) {
        // @ts-ignore
        const colour = textAvatar[key];
        $(`#${key}`).val(colour);
        $(':root').css({
            [`--${key}`]: colour,
        });
    }
}
