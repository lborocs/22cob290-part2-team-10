import '../utils/redirect';

// ------ script for sidebar button --------
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });
});
