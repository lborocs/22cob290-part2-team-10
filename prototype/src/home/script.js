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
// TODO: impl system for not allowing to create new tasks with titles already used
// const task_titles = new Set<string>();
// DONE TODO: update add_task form validation (bootstrap form validation + use button as submit)
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
    $("#task_info").on("submit", function (e) {
        e.preventDefault();
        const $this = $(this);
        const { title, description, tags } = Object.fromEntries(new FormData(this));
        const taskContainerId = modal.attr("data-id");
        $(`#${taskContainerId}`).append(`
    <div class="card mb-3 drag_item" id="task-${title}" draggable="true" ondragstart="drag(event)" >
      <div class="card-body">
        <button type="button" class="close" aria-label="Close" onclick="remove_task(this)">
          <span>&times;</span>
        </button>
        <br>
        <div class="mb-2">
          ${process_tags(tags)}
        </div>
        <p style="font-weight: bold">${title}</p>
        <p class="mb-0 overflow-auto">${description}</p>
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
        return tags.split(",")
            .map((tag) => `<span class="badge bg-primary text-white mx-1">${tag.trim()}</span>`)
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
    const task_card = button.parentElement.parentElement;
    $(task_card).remove();
};
export {};
