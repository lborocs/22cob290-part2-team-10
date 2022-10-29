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
  $('#show-password').on('click', function (e) {
    const $password = $('#password');

    const showing = $password.prop('type') === 'text';

    $password.prop('type', showing ? 'password' : 'text');

    const $eye = $('#eye');
    $eye.removeClass(showing ? 'bi-eye-slash-fill' : 'bi-eye-fill');
    $eye.addClass(showing ? 'bi-eye-fill' : 'bi-eye-slash-fill');
  });


  // TODO: fix onchange not firing except when submitting form
  $('#login-form').on('change', '#email #password', function (e) {
    console.log(this);
  })

  // TODO: on type remove invalid (not sure if this is correct)
  // $('#email #password').on('change', function (e) {
  //   console.log('change');
  //   console.log(this);
  //   $(this).removeClass('is-invalid');
  // });

  // $('#password').on('change', function (e) {
  //   $('#pwError').text('');
  // });

  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const $this = $(this);

    const { email, password } = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;

    if (!isValidWorkEmail(email)) {
      alert('Invalid email!');
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      $('#pwError').text(pwError);
      return;
    }

    login($this);
  });

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

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

function redirect(url: string) {
  window.location.href = url;
}

function login($form: JQuery<HTMLElement>) {
  $('#login-btn').prop('disabled', true);

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: $form.serialize(),
    dataType: 'json',
  })
    .done((data: LoginResponse) => {
      if (data.success) {
        // TODO: store email in localStorage? so other pages can access it
        // localStorage.setItem('email', credentials.email);

        //redirect('todo');

        console.log('LOGGED IN');
      } else {
        console.log(data);

        // TODO: notify that incorrect password/email/whatever (not an alert, some sort of like tooltip/overlay)

        switch (data.errorMessage) {
          case LoginFailedReason.DOESNT_EXIST:
            console.log('bad email');
            $('#email').addClass('is-invalid');
            break;

          case LoginFailedReason.WRONG_PASSWORD:
            console.log('bad password');
            $('#password').addClass('is-invalid');
            break;

          default:
            $('#email #password').addClass('is-invalid');
            $('pwError').text(data.errorMessage);
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
