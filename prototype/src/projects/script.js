import '../utils/redirect';
/* By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element. -w3schools*/
// @ts-ignore
window.allowDrop = function allowDrop(ev) {
    ev.preventDefault();
};
// @ts-ignore
window.drag = function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};
// @ts-ignore
window.drop = function drop(ev) {
    const _target = $(ev.target);
    const data = ev.dataTransfer.getData("text");
    ev.preventDefault();
    if (_target.hasClass("tasks")) {
        ev.target.appendChild(document.getElementById(data));
    }
    else {
        console.log("no transfer");
    }
};
// 'Title' is hardcoded in home.php
const taskTitles = new Set(['Title']);
$(() => {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    // Get the modal
    const modal = $("#modal");
    $('#title').on('input', function (e) {
        $(this).removeClass('is-invalid');
    });
    $("#assignee_select").on("change", function (e) {
        $(this).removeClass('is-invalid');
    });
    // All buttons for modal
    const close_modal_button1 = $("#close_modal1");
    const close_modal_button2 = $("#close_modal2");
    $("#task_info").on("submit", function (e) {
        e.preventDefault();
        const $this = $(this);
        let { title, description, tags, assignee } = Object.fromEntries(new FormData(this));
        title = title.trim();
        description = description.trim();
        tags = tags.trim();
        const assigneeName = assignee.substring(0, assignee.indexOf("@"));
        let formError = false;
        if (!assigneeName) {
            $("#assignee_select").addClass("is-invalid");
            formError = true;
        }
        if (taskTitles.has(title)) {
            $("#title").addClass("is-invalid");
            formError = true;
        }
        if (formError)
            return;
        // TODO: call to backend to add task
        const taskContainerId = modal.attr("data-id");
        $(`#${taskContainerId}`).append(`
    <div class="card mb-3 drag_item" id="task-${title}" draggable="true" ondragstart="drag(event)" >
      <div class="card-body pt-3 pb-2">
        <button type="button" class="close" aria-label="Close" onclick="remove_task(this)">
          <span>&times;</span>
        </button>
        <div class="task-tags mb-2">
          ${process_tags(tags)}
        </div>
        <p class="card-title task-title mb-1">${title}</p>
        <p class="card-text task-description mb-0 overflow-auto">${description}</p>
      </div>
      <div class="card-footer text-muted text-center py-1">
        ${assigneeName}
      </div>
    </div>
    `);
        $this.trigger("reset");
        close_modal();
    });
    function close_modal() {
        modal.css("display", "none");
    }
    function process_tags(tags) {
        const trimmed_tags = tags.split(",").map(tag => tag.trim());
        const unique_tags = [...new Set(trimmed_tags)];
        return unique_tags.map((tag) => `<span class="badge bg-primary text-white mx-1">${tag}</span>`)
            .join("");
    }
    $(".open_modal").on("click", function (e) {
        const $this = $(this);
        const taskContainerId = $this.attr("data-id");
        modal.attr("data-id", taskContainerId);
        modal.css("display", "block");
    });
    close_modal_button1.on("click", close_modal);
    close_modal_button2.on("click", close_modal);
});
// @ts-ignore
window.remove_task = function remove_task(button) {
    const taskCard = button.parentElement.parentElement;
    const $taskCard = $(taskCard);
    const title = $taskCard.find(".task-title").text();
    taskTitles.delete(title);
    $taskCard.remove();
};
