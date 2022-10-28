$(() => {
  console.log("ok");
  console.log("hi");

  $('#login-form').submit(function(e) {
    e.preventDefault();
    const $this = $(this);

    console.log("LOGIN:");
    console.log($this.serialize());
  });

  $('.multiline-tooltip').tooltip({ html: true });
});
