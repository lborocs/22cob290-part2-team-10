<?php

$email = $_REQUEST['email'] ?? 'johndoe@make-it-all.co.uk';

?><!DOCTYPE html>

<html lang="en" data-email="<?= $email ?>">

<head>
  <meta charset="UTF-8">
  <title>Staff Overview</title>

  <!--BOOTSTRAP CDN-->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  <link rel="stylesheet" href="manager_staff_assignment/style.css">
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
              <label class="control-label" for="employees">Employee:</label>
              <div>
                <select class="form-select" id="employees" required>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label" for="roles">Role:</label>
              <div>
                <select class="form-select" id="roles" required>
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

  <main class="wrapper">

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <span class="navbar-brand mb-0 h1">Staff Assignment</span>
      <button class="btn btn-dark d-inline-block d-lg-none ml-auto" id="navCollapse" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-align-justify"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="nav navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="dashboard">Back to Manager Dashboard</a>
          </li>
        </ul>
      </div>
    </nav>

    <div>
      <ul class="list-group" id="staff_list">
      </ul>
    </div>
    <br>
    <div class="control-btn-bottom">
      <button type="button" class="btn btn-primary" onclick="open_modal()" id="assign_employee_btn">Assign employee</button>
      <button type="button" class="btn btn-success" id="save_changes_btn">Save changes</button>
    </div>
  </main>

  <!--JQUERY CDN-->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <!-- Popper.JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
  <!-- Bootstrap JS -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>

  <script type="module" src="manager_staff_assignment/staffoverview.js"></script>

</body>

</html>
