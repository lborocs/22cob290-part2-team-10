import { redirect, isValidWorkEmail, validatePassword } from '../utils';

type SignupFailedResponse = {
  success: false
  errorMessage: SignupFailedReason
};

enum SignupFailedReason {
  ALREADY_EXIST = 'ALREADY_EXIST',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

type SignupResponse = SignupFailedResponse | {
  success: true
};

type Credentials = {
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

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

function passwordError(error: string, id: string = 'password') {
  // FIXME: this causes components to resize :/
  $(`#${id}`).addClass('is-invalid');
  $(`#${id}-feedback`).text(error);
}

// hardcoded
function getToken(): string {
  const url = new URL(window.location.href);

  return url.searchParams.get('token') ?? 'bad-token';
}

function signup($form: JQuery<HTMLElement>, { email, password }: Credentials) {
  $('#signup-btn').prop('disabled', true);

  const token = getToken();

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: { email, password, token },
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

