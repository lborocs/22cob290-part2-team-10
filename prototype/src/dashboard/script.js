// ------ script for sidebar button --------
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });
});
// -----------------------------------------

import { redirect } from '../utils';

$(() => {
  $('.nav-link[href]').on(
    'click', function (e) {
      e.preventDefault();
      const url = $(this).attr('href');
      const email = $('html').attr('data-email');
      redirect(url, { email });
    }
  );
});
