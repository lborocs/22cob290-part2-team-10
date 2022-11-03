<!DOCTYPE html>

<html>
  <head>
    <!--BOOTSTRAP CDN-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <!--JQUERY CDN-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="staff_overview.js"></script>
  <link rel="stylesheet" href="style.css">

  <body>
    <div class="container">


	  <h1>
	    Staff Overview
	  </h1>



	  <div
	    <ul class="list-group">
		  <!-- To do:
		  - onclick update employee role on database
		  - onclick delete/update employee details-->
          <li class="list-group-item employeelist">Employee 1
		    <span style="float: right">
			  <select class="form-select">
                <option>Role 1</option>
			    <option>Role 2</option>
			    <option>Role 3</option>
			    <option>Role 4</option>
				<option style="background-color: #FF0000;">DELETE EMPLOYEE</option>
			  </select>
			</span>
		  </li>
          <li class="list-group-item employeelist">Employee 2
		    <span style="float: right">
			  <select class="form-select">
                <option>Role 1</option>
			    <option>Role 2</option>
			    <option>Role 3</option>
			    <option>Role 4</option>
				<option style="background-color: #FF0000;">DELETE EMPLOYEE</option>
			  </select>
			</span>
		  </li>
          <li class="list-group-item employeelist">Employee 3
		    <span style="float: right">
			  <select class="form-select">
                <option>Role 1</option>
			    <option>Role 2</option>
			    <option>Role 3</option>
			    <option>Role 4</option>
				<option style="background-color: #FF0000;">DELETE EMPLOYEE</option>
			  </select>
			</span>
		  </li>
          <li class="list-group-item employeelist">Employee 4
		    <span style="float: right">
			  <select class="form-select">
                <option>Role 1</option>
			    <option>Role 2</option>
			    <option>Role 3</option>
			    <option>Role 4</option>
				<option style="background-color: #FF0000;">DELETE EMPLOYEE</option>
			  </select>
			</span>
		  </li>
        </ul>
	  </div>
	  <br>
	  <button type="button" class="btn btn-primary">Add employee</button>
	  <button type="button" class="btn btn-success">Save changes</button>

	  </div>
	</div>


  </body>

</html>
