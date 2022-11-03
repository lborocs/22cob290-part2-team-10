<!DOCTYPE html>

<html>
  <head>
    <!--BOOTSTRAP CDN-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  </head>

  <body>

  <div id="modal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
	  <div class="modal-content">
	    <div class="modal-header">
		  <h5 class="modal-title">Add employee</h5>
			<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" onclick="close_modal()">
			<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<div class="modal-body">
			<!--POP-UP FORM-->
		  <form role="form" method="POST" id="emp_info" action="">
			<div class="form-group">
			  <label  class="control-label">Employee:</label>
			  <div>
			    <select class="form-select" id="employees" required>
			    </select>
			  </div>
			</div>
			<div class="form-group">
			  <label class="control-label">Role:</label>
		      <div>
			    <select  class="form-select" id="roles" required>
			    </select>
			  </div>
			</div>
		  </form>
		</div>
		<div class="modal-footer">
		  <button type="button" class="btn btn-secondary" onclick="close_modal()">Close</button>
	      <button type="button" class="btn btn-primary" id="add_employee_btn">Add Employee</button>
		</div>
	  </div>
	</div>
  </div>


  <div class="container">
    <h1>
	  Staff Overview
    </h1>
    <div>
	  <ul class="list-group" id="staff_list">
	  </ul>
    </div>
    <br>
    <button type="button" class="btn btn-primary" onclick="open_modal()">Assign employee</button>
    <button type="button" class="btn btn-success" id="save_changes_btn">Save changes</button>

  </div>
</div>


     <!--JQUERY CDN-->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="staffoverview.js"></script>

  </body>

</html>
