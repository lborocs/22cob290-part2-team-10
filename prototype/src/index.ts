$(() => {
  console.log("ok");
  console.log("hi");

  $('#submitBtn').on('click', (e) => {
    e.preventDefault();

    console.log("SUBMIT");
    console.log(e);
  });
});
