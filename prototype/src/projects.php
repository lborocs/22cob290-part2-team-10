<?php

require "store/users.php";
require "store/projects.php";
require "php/credentials.php";

$email = require_and_get_email();
$user = get_user($email);
$role = $user['role'];

$name = $_REQUEST['name'] ?? null;

$is_manager = $role === Role::MANAGER;
$can_add_projects = $is_manager || $role === Role::TEAM_LEADER;

$projects = get_project_names($email);
$emails = get_all_emails_not_left();

$no_project = $name === null || !in_array($name, $projects);

function tag_to_html(string $tag): string
{
  return "<span class='badge bg-primary text-white mx-1'>$tag</span>";
}

/**
 * @param Task $task
 */
function task_to_html(object $task): string
{
  $tags_html = array_map('tag_to_html', $task->tags);
  $tags_html = join($tags_html);

  return <<<HTML
  <div class="card mb-3 drag_item" id="task-{$task->title}" draggable="true" ondragstart="drag(event)" >
    <div class="card-body pt-3 pb-2">
      <button type="button" class="close" aria-label="Close" onclick="remove_task(this)">
        <span>&times;</span>
      </button>
      <div class="task-tags mb-2">
        $tags_html
      </div>
      <p class="card-title task-title mb-1">{$task->title}</p>
      <p class="card-text task-description mb-0 overflow-auto">{$task->description}</p>
    </div>
    <div class="card-footer text-muted text-center py-1">
      {$task->assignee}
    </div>
  </div>
  HTML;
}

?><!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title><?= $name ?? 'Make-It-All Projects' ?></title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  <!-- Bootstrap CSS CDN -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
  <!-- Our Custom CSS -->
  <link rel="stylesheet" href="projects/style.css">

  <!-- Font Awesome JS -->
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
    integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
    crossorigin="anonymous"></script>
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js"
    integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY"
    crossorigin="anonymous"></script>
</head>

<body>
<main class="wrapper">
  <!-- Sidebar -->
  <nav id="sidebar">
    <div class="sidebar-header">
      <a href="home">
        <img src="assets/company-logo.png" alt="company logo" id="company-logo">
      </a>
    </div>

    <div class="components sidebar-list">
      <p><?= $is_manager ? 'Managed' : 'Assigned' ?> Projects:</p>
      <ul class="list-unstyled" id="projects-list">
        <?php
        foreach ($projects as $project_name) {
          $li_class = $project_name === $name ? 'active' : '';

          echo <<<HTML
            <li class="$li_class">
              <a class="nav-link" href="projects?name=$project_name">$project_name</a>
            </li>
          HTML;
        }
        ?>
      </ul>
    </div>
  </nav>

  <div id="content">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button type="button" id="sidebarCollapse" class="btn sidebar-toggle-btn">
          <i class="fas fa-align-left"></i>
          <span>Toggle Sidebar</span>
        </button>
        <button class="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse"
          data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <i class="fas fa-align-justify"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="nav navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="forum">Forum</a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" <?= $no_project ? '' : 'href="projects"' ?>>Projects</a>
            </li>
            <?php if ($is_manager): ?>
              <li class="nav-item">
                <a class="nav-link" href="dashboard">Dashboard</a>
              </li>
            <?php endif ?>
            <li class="nav-item">
              <a href="profile" >
                <span class="nav-link d-lg-none d-md-block">Profile</span>
                <span class="text-avatar d-none d-lg-block">
                  <?= strtoupper($email[0]) ?>
                </span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>

    <?php
    if ($no_project) {
      echo <<<HTML
        <div>
          <div class="pb-4 d-flex align-items-center justify-content-center">
            <h2>Please select a project</h2>
          </div>
      HTML;

      $row_len = 4;
      $rows = array_chunk($projects, $row_len);

      echo '<div class="container pt-4">';

      foreach ($rows as $row) {
        echo '<div class="row justify-content-start">';

        // TODO: make project card look better & bigger vertical gutter
        foreach ($row as $project_name) {
          echo <<<HTML
            <div class="col-3">
              <a href="projects?name=$project_name">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">$project_name</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p class="card-text">eeeee</p>
                  </div>
                </div>
              </a>
            </div>
          HTML;
        }

        // spacing if row isn't full
        $chunk_len = count($row);
        for ($i = $chunk_len; $i <= $row_len; $i++) {
          echo '<div class="col-3"></div>';
        }

        echo '</div>';
      }

      echo '</div></div>';
    } else {
      $project_data = get_project_data($name);
    ?>
    <!-- KBOARD -->
    <div class="container">
      <h3><?= $name ?></h3>

      <div id="modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add task</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" id="close_modal1">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!--POP-UP FORM-->
              <form role="form" method="POST" id="task_info" action="">
                <!-- title -->
                <div class="form-group">
                  <label class="control-label" for="title">Title</label>
                  <div>
                    <input type="text" class="form-control input-lg" name="title" id="title" placeholder="Title"
                      pattern="^[^\s]+.*$" required>
                    <div class="invalid-feedback">
                      Please use a unique task title.
                    </div>
                  </div>
                </div>

                <!-- description -->
                <div class="form-group">
                  <label class="control-label" for="description_textarea">Description</label>
                  <div>
                    <textarea class="form-control" id="description_textarea" rows="3" name="description"
                      placeholder="Task description" pattern="^[^\s]+.*$" required></textarea>
                  </div>
                </div>

                <!-- tags -->
                <div class="form-group">
                  <label class="control-label" for="tags_textarea">Tags</label>
                  <div>
                    <textarea class="form-control" id="tags_textarea" name="tags" rows="2"
                      placeholder="Enter tags, separated by commas"></textarea>
                  </div>
                </div>

                <!-- assigned employee -->
                <div class="form-group">
                  <label class="control-label" for="assignee_select">Assignee</label>
                  <div>
                    <select class="custom-select" id="assignee_select" name="assignee" required>
                      <option selected>Select employee</option>
                      <?php
                      foreach ($emails as $email) {
                        $name = strtok($email, '@');

                        echo <<<HTML
                          <option value="$email">$name</option>
                        HTML;
                      }
                      ?>
                    </select>
                    <div class="invalid-feedback">
                      Please select an employee.
                    </div>
                  </div>
                </div>

              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="close_modal2">Close</button>
              <button type="submit" form="task_info" class="btn btn-primary">Add task</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!--TO DO COLUMN-->
        <div class="col-12 col-lg-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title">To Do</h5>
            </div>
            <div class="tasks-parent m-2">
              <!-- List of tasks will be stored inside this card div
              ondragover event specifies where the dragged data can be dropped-->
              <div class="tasks scroll" id="to_do" ondrop="drop(event)" ondragover="allowDrop(event)">
                <?php
                foreach ($project_data->todo as $task) {
                  echo task_to_html($task);
                }
                ?>
              </div>
            </div>
            <?php if ($can_add_projects): ?>
              <div class="card-footer">
                <button class="btn btn-primary btn-block open_modal" data-id="to_do">
                  Add task
                </button>
              </div>
            <?php endif ?>
          </div>
        </div>

        <!--IN PROGRESS COLUMN-->
        <div class="col-12 col-lg-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title">In Progress</h5>
            </div>
            <div class="tasks-parent m-2">
              <div class="tasks scroll" id="in_progress" ondrop="drop(event)" ondragover="allowDrop(event)">
                <?php
                foreach ($project_data->in_progress as $task) {
                  echo task_to_html($task);
                }
                ?>
              </div>
            </div>
            <?php if ($can_add_projects): ?>
              <div class="card-footer">
                <button class="btn btn-primary btn-block open_modal" data-id="in_progress">
                  Add task
                </button>
              </div>
            <?php endif ?>
          </div>
        </div>

        <!--CODE REVIEW COLUMN-->
        <div class="col-12 col-lg-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title">Code Review</h5>
            </div>
            <div class="tasks-parent m-2">
              <div class="tasks scroll" id="code_review" ondrop="drop(event)" ondragover="allowDrop(event)">
                <?php
                foreach ($project_data->code_review as $task) {
                  echo task_to_html($task);
                }
                ?>
              </div>
            </div>
            <?php if ($can_add_projects): ?>
              <div class="card-footer">
                <button class="btn btn-primary btn-block open_modal" data-id="code_review">
                  Add task
                </button>
              </div>
            <?php endif ?>
          </div>
        </div>

        <!--COMPLETED COLUMN-->
        <div class="col-12 col-lg-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title">Completed</h5>
            </div>
            <div class="tasks-parent m-2">
              <div class="tasks scroll" id="completed" ondrop="drop(event)" ondragover="allowDrop(event)">
                <?php
                foreach ($project_data->completed as $task) {
                  echo task_to_html($task);
                }
                ?>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <?php } ?>
  </div>

</main>

<!-- jQuery CDN - Slim version (=without AJAX) -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
  integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
  crossorigin="anonymous"></script>
<!-- Popper.JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
  integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
  crossorigin="anonymous"></script>
<!-- Bootstrap JS -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
  integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
  crossorigin="anonymous"></script>

<script type="module" src="projects/script.js"></script>
</body>

</html>
