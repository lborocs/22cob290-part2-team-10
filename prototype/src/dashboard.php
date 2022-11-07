<?php

// FIXME: the template doesn't look the exact same as Home & Projects

if (!isset($_REQUEST['user'])) {
  // redirect to login page if not signed in
  header('Location: http://team10.sci-project.lboro.ac.uk/', true, 303);
  die();
}

require "backend/users.php";

$user_json = $_REQUEST['user'];
$user = json_decode($user_json);

$email = $user->email;
$role = Role::from($user->role);

if ($role != Role::MANAGER) {
  die("You do not have access to this page.");
}

// hardcoded
function get_managed_projects(string $email): array
{
  $result = array_map(fn($num): array => [
    'name' => "Project $num",
    'completed' => rand(10, 100),
    'total' => 100,
  ], range(1, 8));

  // for demo
  array_unshift($result, [
    'name' => 'Complete Project',
    'completed' => 100,
    'total' => 100,
  ]);

  return $result;
}

// hardcoded
function get_managed_staff(string $email): array
{
  $result = array_map(fn($num): array => [
    'name' => "Subordinate $num", // we might want to their email not name?
    // idk what these numbers are meant to represent in the code that David did
    'idk1' => rand(10,100),
    'idk2' => 100,
  ], range(1, 8));

  // for demo
  array_unshift($result, [
    'name' => 'Productive employee',
    'idk1' => 100,
    'idk2' => 100,
  ]);

  return $result;
}

?><!DOCTYPE html>
<html lang="en" data-user='<?= $user_json ?>'>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

  <title>Dashboard</title>
  <!-- Bootstrap CSS CDN -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
  <!-- Our Custom CSS -->
  <link rel="stylesheet" href="dashboard/style.css">

  <!-- Font Awesome JS -->
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js" integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ" crossorigin="anonymous"></script>
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js" integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY" crossorigin="anonymous"></script>
</head>

<body>
  <main>
    <div>
      <div id="modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Project</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" id="close_modal1">
                <span>&times;</span>
              </button>
            </div>
            <form id="project_info" onsubmit="append_project(this, event)">
              <div class="modal-body">
                <!--POP-UP FORM-->
                <div class="form-group">
                  <label class="control-label" for="title">Title</label>
                  <div>
                    <input type="text" class="form-control input-lg" name="title" id="title" placeholder="Project name" required>
                  </div>
                  <!-- TODO: bootstrap 5 -->
                  <div class="invalid-feedback">
                    Project name must be unique.
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="close_modal2">Close</button>
                <button type="submit" class="btn btn-primary">Add Project</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="page">
      <div id="sidebar">
        <div class="sidebar-header">
          <br>
          <img src="assets/company-logo.png" alt="company logo" id="company-logo">
        </div>
        <br>
        <p>Email:<br><?= $email ?></p>
      </div>

      <div class="wrapper">

        <!-- navbar left,middle,right: https://stackoverflow.com/a/20362024 -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <!-- left (collapse) -->
          <div class="navbar-collapse collapse w-100 order-1 order-md-0">
            <button type="button" class="btn sidebar-toggle-btn sidebarCollapse">
              <i class="fas fa-align-left"></i>
              <span>Toggle Sidebar</span>
            </button>
          </div>

          <!-- middle -->
          <div class="mx-auto w-100 order-1 d-flex">
            <!--
              have to repeat ToggleSidebar button because I couldn't find a way to make left & middle sticky
              while keeping right collapsable if that makes sense

              - no button to expand left because left is just a ToggleSidebar button which is repeated
            -->
            <button type="button" class="btn sidebar-toggle-btn sidebarCollapse d-inline-block d-lg-none">
              <i class="fas fa-align-left"></i>
            </button>

            <h1 class="navbar-brand mx-auto mb-0">Manager Dashboard</h1>

            <!-- expand right -->
            <button class="btn btn-dark d-inline-block d-lg-none"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
              <i class="fas fa-align-justify"></i>
            </button>
          </div>

          <!-- right (collapse) -->
          <div id="navbarSupportedContent" class="navbar-collapse collapse w-100 order-2">
            <ul class="nav navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="forum">Forum</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="projects?name=Project 7">Projects</a>
              </li>
              <li class="nav-item active">
                <a class="nav-link">Dashboard</a>
              </li>
              <li class="nav-item">
                <a href="profile">
                  <span class="nav-link d-lg-none d-md-block">Profile</span>
                  <span class="text-avatar d-none d-lg-block">
                    <?= strtoupper($email[0]) ?>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div class="scrolling-area">
          <div class="container">
            <div class="row">
              <div class="col-sm">
                <h2>Projects</h2>
                <div class="scrollbar">
                  <ul class="list-group" id="projects_list">
                    <?php
                    $projects = get_managed_projects($email);

                    foreach ($projects as $project) {
                      [
                        'name' => $name,
                        'completed' => $completed,
                        'total' => $total,
                      ] = $project;

                      $progress = floor(($completed / $total) * 100);

                      // TODO: make clickable so they can see more about the project, whether by changing page or
                      // by showing a modal

                      echo <<<HTML
                        <li class="list-group-item">
                          <p
                            contentEditable="true" style="color: black" class="project-name"
                            onfocus="setCurrent(this.textContent)" onblur="validate(this)" onkeydown="validateKey(this, event)"
                          >$name</p>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped bg-info progress-bar-animated"
                                 role="progressbar"
                                 style="width: $progress%;"
                                 aria-valuenow="$progress"
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                                 >
                              $progress%
                            </div>
                          </div>
                        </li>
                      HTML;
                    }
                    ?>
                  </ul>
                </div>
                <button class="btn btn-danger mt-4 open_modal">
                  Add Project
                </button>
              </div>

              <div class="col-sm">
                <h2>Staff Overview</h2>
                <div class="scrollbar">
                  <ul class="list-group">
                    <?php
                    $staff = get_managed_staff($email);

                    foreach ($staff as $employee) {
                      $name = $employee['name'];
                      $num1 = $employee['idk1'];
                      $num2 = $employee['idk2'];

                      $staffprogress = floor(($num1/$num2)*100);

                      echo <<<HTML
                        <li class="list-group-item">
                          $name
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped bg-info progress-bar-animated"
                                 role="progressbar"
                                 style="width: $staffprogress%;"
                                 aria-valuenow="$staffprogress"
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                                 >
                              $staffprogress%
                            </div>
                          </div>
                        </li>
                      HTML;
                    }
                    ?>
                  </ul>
                </div>
                <a href="staff_assignment">
                  <button class="btn btn-danger mt-4">
                    Staff Assignment
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>


  <!-- jQuery CDN - Slim version (=without AJAX) -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <!-- Popper.JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
  <!-- Bootstrap JS -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>

  <script type="module" src="dashboard/script.js"></script>
</body>

</html>
