import '../utils/redirect';

// TODO: in AddTask, assign to employee in project
// TODO LATER: impl hover over task to edit (open modal)

type AddTaskFormData = {
  title: string
  description: string
  tags: string
};

/* By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element. -w3schools*/
// @ts-ignore
window.allowDrop = function allowDrop(ev: Event) {
  ev.preventDefault();
}

// @ts-ignore
window.drag = function drag(ev: DragEvent) {
  ev.dataTransfer!.setData("text", (<HTMLElement>ev.target).id);
}

// @ts-ignore
window.drop = function drop(ev: DragEvent) {
  const _target = $(ev.target as HTMLElement);
  const data = ev.dataTransfer!.getData("text");

  ev.preventDefault();
  if (_target.hasClass("tasks")) {
    (<HTMLElement>ev.target).appendChild(document.getElementById(data)!);
  } else {
    console.log("no transfer");
  }
}

// 'Title' is hardcoded in home.php
const taskTitles = new Set<string>(['Title']);

$(() => {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });


  // Get the modal
  const modal = $("#modal");

  $('#title').on('input', function (e) {
    $(this).removeClass('is-invalid');
  });

  // All buttons for modal
  const close_modal_button1 = $("#close_modal1");
  const close_modal_button2 = $("#close_modal2");

  $("#task_info").on("submit", function (e) {
    e.preventDefault();

    const $this = $(this);

    let { title, description, tags } = <AddTaskFormData>Object.fromEntries(new FormData(<HTMLFormElement>this));

    title = title.trim();
    description = description.trim();
    tags = tags.trim();

    if (taskTitles.has(title)) {
      $("#title").addClass("is-invalid");
      return;
    } else {
      taskTitles.add(title);
    }

    const taskContainerId = modal.attr("data-id");

    $(`#${taskContainerId}`).append(`
    <div class="card mb-3 drag_item" id="task-${title}" draggable="true" ondragstart="drag(event)" >
      <div class="card-body">
        <button type="button" class="close" aria-label="Close" onclick="remove_task(this)">
          <span>&times;</span>
        </button>
        <div class="task-tags mb-2">
          ${process_tags(tags)}
        </div>
        <p class="task-title" style="font-weight: bold">${title}</p>
        <p class="task-description mb-0 overflow-auto">${description}</p>
      </div>
    </div>
    `);

    $this.trigger("reset");

    close_modal();
  });

  function close_modal() {
    modal.css("display", "none");
  }

  function process_tags(tags: string): string {
    return tags.split(",")
      .map((tag) => `<span class="badge bg-primary text-white mx-1">${tag.trim()}</span>`)
      .join("");
  }

  $(".open_modal").on("click", function (e) {
    const $this = $(this);

    const taskContainerId = $this.attr("data-id")!;

    modal.attr("data-id", taskContainerId);
    modal.css("display", "block");
  });

  close_modal_button1.on("click", close_modal);
  close_modal_button2.on("click", close_modal);
});

// @ts-ignore
window.remove_task = function remove_task(button: HTMLButtonElement) {
  const taskCard = button.parentElement!.parentElement!;

  const $taskCard = $(taskCard);

  const title = $taskCard.find(".task-title").text();
  taskTitles.delete(title);

  $taskCard.remove();
}
