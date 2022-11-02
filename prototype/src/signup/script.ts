import { redirect, isValidWorkEmail, validatePassword } from '../utils';

type SignupFailedResponse = {
  success: false
  errorMessage: SignupFailedReason
};

enum SignupFailedReason {
  ALREADY_EXIST = 'ALREADY_EXIST',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USED_TOKEN = 'USED_TOKEN',
}

type SignupResponse = SignupFailedResponse | {
  success: true
};

type Credentials = {
  token: string
  email: string
  password: string
  confirm: string
};

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

  $('#token, #email, #password, #confirm').on('input', function (e) {
    $(this).removeClass('is-invalid');
  });

  $('#signup-form').on('submit', function (e) {
    e.preventDefault();
    const $this = $(this);

    const credentials = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;

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

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

function signup($form: JQuery<HTMLElement>, { token, email, password }: Credentials) {
  $('#signup-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: { token, email, password },
    dataType: 'json',
  })
    .done((res: SignupResponse) => {
      if (res.success) {
        redirect('todo', { email });
      } else {
        console.log(res);

        switch (res.errorMessage) {
          case SignupFailedReason.ALREADY_EXIST:
            $('#email').addClass('is-invalid');
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

// FIXME: this causes components to resize :/ (i think because it's a input-group and it doesnt have the noWrap class or smthn like that)
function passwordError(error: string, id: string = 'password') {
  $(`#${id}`).addClass('is-invalid');
  $(`#${id}-feedback`).text(error);
}

function tokenError(error: string) {
  $('#token').addClass('is-invalid');
  $('#token-feedback').text(error);
}
