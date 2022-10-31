/*By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element. -w3schools*/
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

$(function() {
	
	
	/* TRY TO MAKE MORE EFFICIENT USING TECHNIQUE LIKE 
	var span = document.getElementsByClassName("close")[0];*/
	
	
	
    // Get the different modals
	var to_do_modal = document.getElementById("to_do_modal");
	var in_progress_modal = document.getElementById("in_progress_modal");
	var code_review_modal = document.getElementById("code_review_modal");
	var completed_modal = document.getElementById("completed_modal");

	// Get the buttons that opens the modals
	var to_do_btn = document.getElementById("to_do_button");
	var in_progress_button = document.getElementById("in_progress_button");
	var code_review_button = document.getElementById("code_review_button");
	var completed_button = document.getElementById("completed_button");
	
	var close_to_do_modal_button = document.getElementById("close_to_do_modal");
	var close_to_do_modal_button2 = document.getElementById("close_to_do_modal2");
	
	var add_task_to_do = document.getElementById("add_task_to_do");

	// When the user clicks the different buttons, open the different modals
	to_do_btn.onclick = function() {
	  to_do_modal.style.display = "block";
	}
	in_progress_button.onclick = function() {
	  in_progress_modal.style.display = "block";
	}
	code_review_button.onclick = function() {
	  code_review_modal.style.display = "block";
	}
	completed_button.onclick = function() {
	  completed_modal.style.display = "block";
	}
	
	function close_to_do_modal(){
		to_do_modal.style.display = "none";
	}

	close_to_do_modal_button.onclick = close_to_do_modal();
	close_to_do_modal_button2.onclick = close_to_do_modal();	
	
	add_task_to_do.onclick = console.log("test");

});
