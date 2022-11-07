// redirect with data: https://stackoverflow.com/a/10022098
export default function redirect(url, data) {
    const $form = $(`
  <form action="${url}" method="POST" class="d-none">
    ${Object.entries(data).map(([key, value]) => `<input name="${key}" value='${JSON.stringify(value)}' />`).join('')}
  </form>
  `);
    $('body').append($form);
    $form.trigger('submit');
}
$(() => {
    $('a[href]').on('click', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        const user = JSON.parse($('html').attr('data-user'));
        redirect(url, { user });
    });
});