import { Role } from '../types';
import { isValidWorkEmail, validatePassword } from '../utils';
import redirect from '../utils/redirect';

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
  role: Role
};

type Credentials = {
  token: string
  email: string
  password: string
  confirm: string
};

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

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

function signup($form: JQuery, { token, email, password }: Credentials) {
  $('#signup-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: { token, email, password },
    dataType: 'json',
  })
    .done((res: SignupResponse) => {
      if (res.success) {
        const role = res.role;

        switch (role) {
          case Role.MANAGER:
            redirect('dashboard', {user: {email, role}});
            break;

          default:
            redirect('home', {user: {email, role}});
        }
      } else {
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

          default: // shouldn't happen
            emailError(res.errorMessage);
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

function formIsInvalid($form: JQuery): boolean {
  return $form.find('.is-invalid').length > 0;
}

function emailError(error: string) {
  $('#email').addClass('is-invalid');
  $('#email-feedback').text(error);
}

function passwordError(error: string, id: string = 'password') {
  $(`#${id}`).addClass('is-invalid');
  $(`#${id}-feedback`).text(error);
}

function tokenError(error: string) {
  $('#token').addClass('is-invalid');
  $('#token-feedback').text(error);
}
