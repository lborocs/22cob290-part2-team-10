$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

/*ADDED CODE FROM KBOARD*/
/*By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element. -w3schools*/
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	var _target = $("#" + ev.target.id);
	var data = ev.dataTransfer.getData("text");
	if ($(_target).hasClass("noDrop")) {
		console.log("no transfer");
		ev.preventDefault();
	} else {
		ev.preventDefault();
		ev.target.appendChild(document.getElementById(data));
	}
}

$(function() {
	/* TRY TO MAKE MORE EFFICIENT USING TECHNIQUE LIKE 
	var span = document.getElementsByClassName("close")[0];*/
	
    // Get the modal
	var modal = $("#modal");
	
	// Get the buttons that opens the modals
	var to_do_btn = $("#to_do_button");
	var in_progress_button = $("#in_progress_button");
	var code_review_button = $("#code_review_button");
	var completed_button = $("#completed_button");
	
	// All buttons for modal
	var close_modal_button1 = $("#close_modal1");
	var close_modal_button2 = $("#close_modal2");
	var add_task_modal_button = $("#add_task");
	
	var taskno = 2;
	
	function open_modal(id){
		add_task_modal_button.prop("onclick", null).off("click");
		add_task_modal_button.on('click', () => add_task(id));
		
		modal.css('display',"block");
		
	}
	
	function close_modal(){
		modal.css('display',"none");
	}
	
	function process_tags(tags) {
		var tagsArr=tags.split(",");
		var output = "";
		
		for (tag of tagsArr) {
			output = output.concat(`<span class='badge bg-primary text-white mb-2 mx-1'>${tag}</span>`)
		}
		
		return output;
	}
	
	function validate_form(form_data) {
		if (form_data.title == "") {
			alert("Title must be filled out");
			return false;
		} else if (form_data.description == ""){
			alert("Task needs a description");
			return false;
		}
			
		return true;
	}
	
	function add_task(id) {
		
		var task_form = $('#task_info')[0];
		
		const form_data = Object.fromEntries(new FormData(task_form));
		const { title, description, tags } = form_data;
		
		if (!validate_form(form_data)) {
			return;
		}
			
		// handle form
		$(`#${id}`).append(
		`<div class="card mb-3 drag_item noDrop" id="task`+ taskno +`" draggable="true" ondragstart="drag(event)">
		  <div class="card-body">
			${process_tags(tags)}
			<p style="font-weight: bold">${title}</p>
			<p class="mb-0">${description}</p>
		  </div>
		</div>`
		);
		
		task_form.reset();
		console.log(taskno);

		taskno++;
		
		close_modal();
	}
	
	$('.open_modal').on('click', function (e) {
		const $this = $(this);
		
		const target_id = $this.attr('data-id');
		console.log(target_id);
		open_modal(target_id);
	});

	close_modal_button1.on('click', close_modal);
	close_modal_button2.on('click', close_modal);
});

