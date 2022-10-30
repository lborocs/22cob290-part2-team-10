import { redirect, isValidWorkEmail } from '../../utils';
$(() => {
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const $this = $(this);
        const credentials = Object.fromEntries(new FormData(this));
        console.log(credentials);
        const { email, password } = credentials;
        console.log($this.serialize());
        if (!isValidWorkEmail(email)) {
            alert('Invalid email!');
            return;
        }
        if (!isValidPassword(password)) {
            alert('Invalid password!');
            return;
        }
        $('#login-btn').prop('disabled', true);
        $.ajax({
            url: $this.attr('action'),
            type: $this.attr('method'),
            data: $this.serialize(),
            dataType: 'json',
        })
            .done((data) => {
            if (data.success) {
                // TODO: store email in localStorage? so other pages can access it
                // localStorage.setItem('email', credentials.email);
                console.log(data);
                alert(JSON.stringify(data));
                redirect('todo', { email });
            }
            else {
                // TODO: notify that incorrect password/email/whatever (not an alert, some sort of like tooltip)
                alert(`ERROR: ${data.errorMessage}`);
            }
        })
            .fail((xhr, errorTextStatus, errorMessage) => {
            alert(`${errorTextStatus}: ${errorMessage}`);
        })
            .always(() => {
            $('#login-btn').prop('disabled', false);
        });
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
function isValidPassword(password) {
    if (password.length < 12)
        return false;
    return PASSWORD_REGEX.test(password);
}
