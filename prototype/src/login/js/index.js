$(function () {
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        var $this = $(this);
        console.log("LOGIN:");
        console.log($this.serialize());
        // TODO: validate email & pw
        $('#login-btn').prop('disabled', true);
        $.ajax({
            url: $this.attr('action'),
            type: $this.attr('method'),
            data: $this.serialize(),
            dataType: 'json'
        })
            .done(function (data) {
            if (data.success) {
                // TODO: go to main page
                console.log(data);
                alert(JSON.stringify(data));
                window.location.href = "/main";
            }
            else {
                // TODO: alert that incorrect password/email/whatever
                alert("ERROR: ".concat(data.errorMessage));
            }
        })
            .fail(function () {
            alert("ERROR: request failed");
        })
            .always(function () {
            $('#login-btn').prop('disabled', false);
        });
    });
    $('.multiline-tooltip').tooltip({ html: true });
});
