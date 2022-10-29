"use strict";
$(() => {
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const { email, password } = Object.fromEntries(new FormData(this));
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
    $('.multiline-tooltip').tooltip({ html: true });
});
function login($form) {
    $('#login-btn').prop('disabled', true);
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        dataType: 'json',
    })
        .done((data) => {
        if (data.success) {
            // TODO: store email in localStorage? so other pages can access it
            // localStorage.setItem('email', credentials.email);
            redirect('todo');
        }
        else {
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
function redirect(url) {
    window.location.href = url;
}
function isValidWorkEmail(email) {
    return email.endsWith('@make-it-all.co.uk') && email !== '@make-it-all.co.uk';
}
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
function isValidPassword(password) {
    if (password.length < 12)
        return false;
    return PASSWORD_REGEX.test(password);
}
