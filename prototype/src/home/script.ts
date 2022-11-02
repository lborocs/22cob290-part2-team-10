import { redirect } from '../utils';

type AddTaskFormData = {
  title: string
  description: string
  tags: string
};

/* By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element. -w3schools*/
function allowDrop(ev: Event) {
  ev.preventDefault();
}
function drag(ev: DragEvent) {
  ev.dataTransfer!.setData("text", (<HTMLElement>ev.target).id);
}

function drop(ev: DragEvent) {
  const _target = $(ev.target as HTMLElement);
  const data = ev.dataTransfer!.getData("text");

  ev.preventDefault();
  if (_target.hasClass("tasks")) {
    (<HTMLElement>ev.target).appendChild(document.getElementById(data)!);
  } else {
    console.log("no transfer");
  }
}

// TODO: impl system for not allowing to create new tasks with titles already used
// const task_titles = new Set<string>();

// TODO: update add_task form validation (bootstrap form validation + use button as submit)

// TODO: impl hover over task to edit (open modal)

$(() => {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });


  // Get the modal
  const modal = $("#modal");

  // All buttons for modal
  const close_modal_button1 = $("#close_modal1");
  const close_modal_button2 = $("#close_modal2");
  const add_task_modal_button = $("#add_task");

  function open_modal(task_container_id: string) {
    // remove previous onclick listener: https://stackoverflow.com/a/1687805
    add_task_modal_button.prop("onclick", null).off("click");

    add_task_modal_button.on("click", () => add_task(task_container_id));

    show_modal();
  }

  function show_modal() {
    modal.css("display", "block");
  }

  function close_modal() {
    modal.css("display", "none");
  }

  function process_tags(tags: string): string {
    return tags.split(",")
      .map((tag) => `<span class='badge bg-primary text-white mb-2 mx-1'>${tag.trim()}</span>`)
      .join("");
  }

  function validate_form(form_data: AddTaskFormData): boolean {
    if (form_data.title === "") {
      alert("Title must be filled out");
      return false;
    } else if (form_data.description === "") {
      alert("Task needs a description");
      return false;
    }

    return true;
  }

  function add_task(task_container_id: string) {
    const task_form = $("#task_info")[0] as HTMLFormElement;

    const form_data = Object.fromEntries(new FormData(task_form)) as AddTaskFormData;
    const { title, description, tags } = form_data;

    if (!validate_form(form_data)) {
      return;
    }

    $(`#${task_container_id}`).append(`
    <div class="card mb-3 drag_item" id="task-${title}" draggable="true" ondragstart="drag(event)" >
      <div class="card-body">
        <button type="button" class="close" aria-label="Close" onclick="remove_task(this)">
          <span aria-hidden="true">&times;</span>
        </button>
        <br>
        ${process_tags(tags)}
        <p style="font-weight: bold">${title}</p>
        <p class="mb-0">${description}</p>
      </div>
    </div>
    `);

    task_form.reset();

    close_modal();
  }

  $(".open_modal").on("click", function (e) {
    const $this = $(this);

    const task_container_id = $this.attr("data-id")!;
    open_modal(task_container_id);
  });

  close_modal_button1.on("click", close_modal);
  close_modal_button2.on("click", close_modal);
});

function remove_task(button: HTMLButtonElement) {
  const $button = $(button);
  console.log(button);

  const task_card = $button.parent().parent();
  task_card.remove();
}
