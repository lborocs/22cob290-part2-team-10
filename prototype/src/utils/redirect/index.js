// redirect with data: https://stackoverflow.com/a/10022098
export default function redirect(url, data) {
    const $form = $(`
  <form action="${url}" method="POST">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value="${value}" />`).join('')}
  </form>
  `);
    $('body').append($form);
    $form.trigger('submit');
}
$(() => {
    $('.nav-link[href]').on('click', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        const email = $('html').attr('data-email');
        redirect(url, { email });
    });
});
