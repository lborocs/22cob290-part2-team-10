import { redirect, isValidWorkEmail } from '../../utils';

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

// TODO: TOO_LONG? need to ask on forum
enum PasswordError {
  TOO_SHORT = 'Too short',
  NO_UPPERCASE = 'No uppercase letter',
  NO_LOWERCASE = 'No lowercase letter',
  NO_NUMBER = 'No number',
  NO_SPECIAL_SYMBOL = 'No special symbol',
}

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

<<<<<<< HEAD
    const credentials = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;
=======
    const { email, password } = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;
>>>>>>> 7b11394 (Remove excessive console logging or smthn idk, fixed conflict)

    if (!isValidWorkEmail(credentials.email)) {
      alert('Invalid email!');
      return;
    }

<<<<<<< HEAD
    const pwError = validatePassword(credentials.password);
    if (pwError) {
      passwordError(pwError);
=======
    const pwError = validatePassword(password);
    if (pwError) {
      $('#pwError').text(pwError);
>>>>>>> b0f4aa8 (Implement better password policy validation (not finished))
      return;
    } else {
      $('#pwError').text('');
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

function isValidWorkEmail(email: string): boolean {
  return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}

const LOWERCASE_REGEX = /(?=.*[a-z])/;
const UPPERCASE_REGEX = /(?=.*[A-Z])/;
const NUMBER_REGEX = /(?=.*\d)/;
const SPECIAL_SYMBOL_REGEX = /(?=.*\W)/;

function validatePassword(password: string): PasswordError | null {
  if (password.length < 12)
    return PasswordError.TOO_SHORT;

  if (!LOWERCASE_REGEX.test(password))
    return PasswordError.NO_LOWERCASE;

  if (!UPPERCASE_REGEX.test(password))
    return PasswordError.NO_UPPERCASE;

  if (!NUMBER_REGEX.test(password))
    return PasswordError.NO_NUMBER;

  if (!SPECIAL_SYMBOL_REGEX.test(password))
    return PasswordError.NO_SPECIAL_SYMBOL;

  return null;
}

<<<<<<< HEAD
// redirect with data: https://stackoverflow.com/a/10022098
function redirect(url: string, data: Record<string, string>) {
  const $form = $(`
  <form action="${url}" method="POST">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value="${value}" />`).join('')}
  </form>
  `);

  $('body').append($form);
  $form.trigger('submit');
}

function login($form: JQuery<HTMLElement>, { email, password }: Credentials) {
=======
function redirect(url: string) {
  window.location.href = url;
}

function login($form: JQuery<HTMLElement>) {
>>>>>>> b0f4aa8 (Implement better password policy validation (not finished))
  $('#login-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: $form.serialize(),
    dataType: 'json',
  })
<<<<<<< HEAD
    .done((res: LoginResponse) => {
      if (res.success) {
        redirect('todo/', { email });
=======
    .done((data: LoginResponse) => {
      if (data.success) {
        // TODO: store email in localStorage? so other pages can access it
        // localStorage.setItem('email', credentials.email);

        //redirect('todo');
>>>>>>> b0f4aa8 (Implement better password policy validation (not finished))
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
