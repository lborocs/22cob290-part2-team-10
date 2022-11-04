import { resolveModuleName } from 'typescript';
import { redirect, isValidWorkEmail, validatePassword } from '../utils';

type LoginFailedResponse = {
  success: false
  errorMessage: LoginFailedReason
};

enum LoginFailedReason {
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  DOESNT_EXIST = 'DOESNT_EXIST',
}

type LoginResponse = LoginFailedResponse | {
  success: true
  role: Role
};

enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}

type Credentials = {
  email: string
  password: string
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

  $('#email, #password').on('input', function (e) {
    $(this).removeClass('is-invalid');
  });

  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const $this = $(this);

    const credentials = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;

    if (!isValidWorkEmail(credentials.email))
      emailError('Invalid Make-It-All email');

    const pwError = validatePassword(credentials.password);
    if (pwError)
      passwordError(pwError);

    if (formIsInvalid($this))
      return;

    login($this, credentials);
  });

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

function login($form: JQuery<HTMLElement>, { email }: Credentials) {
  $('#login-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: $form.serialize(),
    dataType: 'json',
  })
    .done((res: LoginResponse) => {
      if (res.success) {
        // TODO: maybe if role == MANAGER, show manager dashboard
        const role = res.role;

        switch (role) {
          case Role.MANAGER:
            redirect('dashboard', { email, role });
            break;

          case Role.LEFT_COMPANY:
            alert('You no longer have access to this website');
            break;

          default:
            redirect('home', { email, role });
        }
      } else {
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

function formIsInvalid($form: JQuery): boolean {
  return $form.find('.is-invalid').length > 0;
}

function emailError(error: string) {
  $('#email').addClass('is-invalid');
  $('#email-feedback').text(error);
}

function passwordError(error: string) {
  $('#password').addClass('is-invalid');
  $('#password-feedback').text(error);
}
