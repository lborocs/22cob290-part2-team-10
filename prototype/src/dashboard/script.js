import '../utils/redirect';

// ------ script for sidebar button --------
$(document).ready(function () {
  $('.sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

  const modal = $("#modal");
  // All buttons for modal
  const close_modal_button1 = $("#close_modal1");
  const close_modal_button2 = $("#close_modal2");


  close_modal_button1.on("click", hide_modal);
  close_modal_button2.on("click", hide_modal);

  function show_modal() {
    modal.css("display", "block");
  }

  function hide_modal() {
    modal.css("display", "none");
  }

  $(".open_modal").on("click", show_modal);
  $(".close_modal1").on("click", hide_modal);
  $(".close_modal2").on("click", hide_modal);
  $("#add_project").on("click", add_project);
});

var current_value_being_changed = "";

function get_project_names() {
  const projectNames = $('.project-name').map(function() {
    return $(this).text();
  }).get();
  return projectNames;
}

window.setCurrent = function setCurrent(title) {
  current_value_being_changed = title;
}

window.validate = function validate(element) {
    const invalid =
      get_project_names().filter(item => item == element.innerHTML).length > 1;
    if (invalid){
      element.innerHTML = current_value_being_changed;
      alert('Project name must be unique');
    }
}

// prevent them from entering newlines & instead treat pressing enter as saving project title
window.validateKey = function validateKey(element, event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $(element).trigger("blur");
  }
}

window.append_project = function append_project(form, event) {
  event.preventDefault();
  const form_data = Object.fromEntries(new FormData(form));
  let { title } = form_data;
  title = title.trim();
  const modal = $("#modal");

  if (get_project_names().includes(title)) {
    alert("Project name must be unique");
  } else {
    $("#projects_list").append(`
    <li class="list-group-item">
    <p
      contentEditable="true" style="color: black" class="project-name"
      onfocus="setCurrent(this.textContent)" onblur="validate(this)" onkeypress="validateKey(this, event)"
    >${title}</p>
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-info progress-bar-animated"
            role="progressbar"
            style="width: 0%;"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
            >
          0%
        </div>
      </div>
    </li>
    `);

    form.reset();
    modal.css("display", "none");
  }
};

/*
TO DO:

- MAKE CONTENT EDITABLE P TAGS FOR TASK NAMES UPDATE THE BACK END
- MAKE THE ADD PORJECT ACTUALLY ADD PROJECTS TO BACK END LIST ALL THE PROJECTS STORED ON DATABASE


*/



/*

* change text
* check if item in project names with saem name, that isn't this current item
  -
  * if not change
* if so revert to original text
  - store value on click




*/
