import { redirect, isValidWorkEmail, validatePassword } from '../../utils';

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
};

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

    if (!isValidWorkEmail(credentials.email)) {
      alert('Invalid email!');
      return;
    }

    const pwError = validatePassword(credentials.password);
    if (pwError) {
      passwordError(pwError);
      return;
    }

    login($this, credentials);
  });

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

function passwordError(error: string) {
  // FIXME: this causes components to resize :/
  $('#password').addClass('is-invalid');
  $('#password-feedback').text(error);
}

function login($form: JQuery<HTMLElement>, { email, password }: Credentials) {
  $('#login-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: $form.serialize(),
    dataType: 'json',
  })
    .done((res: LoginResponse) => {
      if (res.success) {
        redirect('todo', { email });
      } else {
        console.log(res);

        switch (res.errorMessage) {
          case LoginFailedReason.DOESNT_EXIST:
            $('#email').addClass('is-invalid');
            break;

          case LoginFailedReason.WRONG_PASSWORD:
            passwordError('Incorrect password!');
            break;

          default:
            $('#email').addClass('is-invalid');
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
