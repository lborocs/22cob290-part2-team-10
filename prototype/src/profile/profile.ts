import '../utils/redirect';
import {copyToClipboard, formIsInvalid, objectToFormData, validatePassword} from '../utils';
import type { User } from '../types';

type ChangePwFormData = {
  email: string
  currentPassword: string
  newPassword: string
  confirm: string
};

type ChangePwFailedResponse = {
  success: false
  errorMessage: ChangePwFailedReason
};

enum ChangePwFailedReason {
  WRONG_PASSWORD = 'WRONG_PASSWORD',
}

type ChangePwResponse = ChangePwFailedResponse | {
  success: true
};

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

    const $this = $<HTMLFormElement>(<HTMLFormElement>this);

    const formData = Object.fromEntries(new FormData(this as HTMLFormElement)) as ChangePwFormData;
    const { email, currentPassword, newPassword, confirm } = formData;

    let pwError = validatePassword(currentPassword);
    if (pwError) {
      passwordError(pwError, 'currentPassword');
    }

    pwError = validatePassword(newPassword);
    if (pwError) {
      passwordError(pwError, 'newPassword');
    } else if (currentPassword === newPassword) {
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

    const user: User = JSON.parse($('html').attr('data-user')!);

    const token = await getInviteToken(user.email);
    const url = `http://team10.sci-project.lboro.ac.uk/signup?token=${token}`;

    $inviteInput.attr('value', url);
  });

  $('#copy-invite-url').on('click', function (e) {
    const $inviteInput = $('#invite-url');

    const url = $inviteInput.attr('value')!;

    copyToClipboard(url)
      .then(() => $inviteInput.addClass('is-valid'))
      .catch((reason = 'Copy failed.') => {
        $inviteInput.addClass('is-invalid');
        $('#copy-failed').text(reason);
      });
  });
});

function passwordError(error: string, id: string) {
  $(`#${id}`).addClass('is-invalid');
  $(`#${id}-feedback`).text(error);
}

function changePassword($form: JQuery<HTMLFormElement>, { email, currentPassword, newPassword }: ChangePwFormData) {
  const $submitBtn = $(`button[form=${$form.attr('id')}]`).prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: { email, currentPassword, newPassword },
    dataType: 'json',
  })
    .done((res: ChangePwResponse) => {
      if (res.success) {
        $('#change-pw-modal').modal('hide');
        $('#pw-changed-toast').toast('show');
      } else {
        console.log(res);

        switch (res.errorMessage) {
          case ChangePwFailedReason.WRONG_PASSWORD:
            passwordError('Incorrect password', 'currentPassword');
            break;

          default:
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

async function getInviteToken(email: string): Promise<string> {
  type GenerateInviteResponse = {
    token: string
  };

  const res: GenerateInviteResponse = await fetch('profile/generate_invite.php', {
    method: 'POST',
    body: objectToFormData({ email }),
  }).then(res => res.json());

  return res.token;
}
