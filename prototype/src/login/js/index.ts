type LoginFailedResponse = {
  success: false
  errorMessage: string
};

type LoginResponse = LoginFailedResponse | {
  success: true
};

type Credentials = {
  email: string
  password: string
};

$(() => {
  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const $this = $(this);

    const { email, password } = Object.fromEntries(new FormData(this as HTMLFormElement)) as Credentials;

    if (!isValidWorkEmail(email)) {
      alert('Invalid email!');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Invalid password!');
      return;
    }

    login($this);
  });

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});

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

        redirect('todo');
      } else {
        console.log(data);

        // TODO: notify that incorrect password/email/whatever (not an alert, some sort of like tooltip/overlay)
        alert(`ERROR: ${data.errorMessage}`);
      }
    })
    .fail((xhr, errorTextStatus, errorMessage) => {
      alert(`${errorTextStatus}: ${errorMessage}`);
    })
    .always(() => {
      $('#login-btn').prop('disabled', false);
    });
}

function redirect(url: string) {
  window.location.href = url;
}

function isValidWorkEmail(email: string): boolean {
  return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}

const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

function isValidPassword(password: string): boolean {
  if (password.length < 12)
    return false;

  return PASSWORD_REGEX.test(password);
}
