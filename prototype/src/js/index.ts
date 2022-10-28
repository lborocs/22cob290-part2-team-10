type LoginFailedResponse = {
  success: false
  errorMessage: string
};

type LoginResponse = LoginFailedResponse | {
  success: true
};

$(() => {
  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const $this = $(this);

    console.log("LOGIN:");
    console.log($this.serialize());

    // TODO: validate email & pw

    $('#login-btn').prop('disabled', true);

    $.ajax({
      url: $this.attr('action'),
      type: $this.attr('method'),
      data: $this.serialize(),
      dataType: 'json',
    })
      .done((data: LoginResponse) => {
        if (data.success) {
          // TODO: go to main page
          console.log(data);
          alert(JSON.stringify(data));
        } else {
          // TODO: alert that incorrect password/email/whatever
          alert(`ERROR: ${data.errorMessage}`);
        }
      })
      .fail(() => {
        alert("ERROR: request failed");
      })
      .always(() => {
        $('#login-btn').prop('disabled', false);
      });
  });

  (<any>$('.multiline-tooltip')).tooltip({ html: true });
});
