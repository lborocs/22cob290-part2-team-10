<?php

$email = $_REQUEST['email'] ?? 'johndoe@make-it-all.co.uk';

// hardcoded
function get_managed_projects(string $email = ''): array
{
  return array_map(fn($num): string => "Project $num", range(1, 9));
}

// hardcoded
function get_managed_staff(string $email = ''): array
{
  return array_map(fn($num): array => [
    'name' => "Subordinate $num", // we're gonna want to return their email not name
    // idk what these numbers are meant to represent in the code that David did
    'idk1' => rand(3, 31),
    'idk2' => 31,
  ], range(1, 9));
}

?><!DOCTYPE html>
<html lang="en">

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
    <div id="page">
      <div id="sidebar">
        <div class="sidebar-header">
          <br>
          <img src="assets/company-logo.png" alt="company logo" id="company-logo">
        </div>
        <br>
        <p>Email:<br><?php echo $email ?></p>
      </div>

      <div class="wrapper">



        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <button type="button" id="sidebarCollapse" class="btn  sidebar-toggle-btn">
            <i class="fas fa-align-left"></i>
            <span>Toggle Sidebar</span>
          </button>
          <span class="navbar-brand mb-0 h1">Manager Dashboard </span>
          <button class="btn btn-dark d-inline-block d-lg-none ml-auto" id="navCollapse" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fas fa-align-justify"></i>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="staff_assignment">Staff Assignment</a>
              </li>
            </ul>
          </div>
        </nav>

        <div class="scrolling-area">
          <div class="container">
            <div class="row">
              <div class="col-sm">
                <h2>Complete projects</h2>
                <div class="scrollbar">
                  <ul class="list-group">
                    <?php
                    $projects = get_managed_projects();

                    foreach ($projects as $project_name) {
                      echo <<<HTML
                        <li class="list-group-item">$project_name</li>
                      HTML;
                    }
                    ?>
                  </ul>
                </div>
              </div>

              <div class="col-sm">
                <h2>Staff Overview</h2>
                <div class="scrollbar">

                  <ul class="list-group">
                    <?php
                    $staff = get_managed_staff();

                    foreach ($staff as $employee) {
                      $name = $employee['name'];
                      $num1 = $employee['idk1'];
                      $num2 = $employee['idk2'];

                      echo <<<HTML
                        <li class="list-group-item">$name<span class="badge badge-light">$num1</span><span class="badge badge-light">$num2</span></li>
                      HTML;
                    }
                    ?>
                  </ul>
                </div>
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

  <script src="dashboard/script.js"></script>
</body>

</html>
