<?php

if (!isset($_REQUEST['user'])) {
  // redirect to login page if not signed in
  header('Location: http://team10.sci-project.lboro.ac.uk/', true, 303);
  die();
}

$user_json = $_REQUEST['user'];
$user = json_decode($user_json);

$email = $user->email;
$role = $user->role;

// Using bootstrap 4.1 cos template was designed using it and i cba to convert it to 5

// maybe just don't have a sidebar?

?><!DOCTYPE html>
<html lang="en" data-user='<?= $user_json ?>'>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Profile</title>

  <!-- jQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

  <!-- Bootstrap CSS? I don't think this is doing anything cos of the one below, but leaving it in in case -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

  <!-- Bootstrap CSS CDN -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">

  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.min.css">

  <!-- Our Custom CSS -->
  <link rel="stylesheet" href="profile/profile.css">

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
      <img src="assets/company-logo.png" alt="company logo" id="company-logo">
    </div>

    <div class="components sidebar-list">
      <!-- TODO: decide what goes in sidebar -->
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
            <li class="nav-item">
              <a class="nav-link" href="projects?name=Project 7">Projects</a>
            </li>
            <li class="nav-item active">
              <a>
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

    <div class="container">

      <article>
        <h3>Email</h3>
        <span><?= $email ?></span>
      </article>

      <br>
      <br>

      <article>
        <h3>Change Password</h3>
        <form id="change-pw-form" action="profile/change_password.php" method="POST" class="mt-6">
          <!-- Email (hidden) -->
          <div class="d-none">
            <label for="email">Email</label>
            <input type="email"
                   value="<?= $email ?>"
                   autocomplete="email"
                   id="email"
                   name="email"
                   required
                   >
          </div>

          <!-- Current password -->
          <div class="form-group row mb-3">
            <label for="current" class="col-sm-3 col-form-label">Current Password</label>
            <div class="col-sm-9 position-relative">
              <div class="input-group has-validation">
                <!-- value="TestPassword123!" -->
                <input type="password"
                       value=""
                       autocomplete="current-password"
                       class="form-control"
                       id="current"
                       name="current"
                       placeholder="Enter current password"
                       minlength="12"
                       maxlength="64"
                       >
                <span class="input-group-text d-inline-block multiline-tooltip"
                      tabindex="0"
                      data-toggle="tooltip"
                      title="At least 1 uppercase<br>At least 1 lowercase<br>At least 1 number<br>At least 1 special symbol"
                      >
                  <i class="bi bi-info-circle-fill"></i>
                </span>
                <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                  <i class="bi bi-eye-fill eye"></i>
                </button>
                <div id="current-feedback" class="invalid-tooltip">
                </div>
              </div>
            </div>
          </div>

          <!-- New password -->
          <div class="form-group row mb-3">
            <label for="password" class="col-sm-3 col-form-label">New Password</label>
            <div class="col-sm-9 position-relative">
              <div class="input-group has-validation">
                <input type="password"
                       value=""
                       autocomplete="new-password"
                       class="form-control"
                       id="password"
                       name="password"
                       placeholder="Enter new password"
                       minlength="12"
                       maxlength="64"
                       >
                <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                  <i class="bi bi-eye-fill eye"></i>
                </button>
                <div id="new-feedback" class="invalid-tooltip">
                </div>
              </div>
            </div>
          </div>

          <!-- Confirm password -->
          <div class="form-group row mb-3">
            <label for="confirm" class="col-sm-3 col-form-label">Confirm Password</label>
            <div class="col-sm-9 position-relative">
              <div class="input-group has-validation">
                <input type="password"
                       autocomplete="new-password"
                       class="form-control"
                       id="confirm"
                       name="confirm"
                       placeholder="Enter new password again"
                       minlength="12"
                       maxlength="64"
                       >
                <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                  <i class="bi bi-eye-fill eye"></i>
                </button>
                <div id="confirm-feedback" class="invalid-tooltip">
                </div>
              </div>
            </div>
          </div>

          <!-- Submit btn -->
          <div class="form-group row">
            <div class="d-flex justify-content-center">
              <button id="change-pw-btn" type="submit" class="btn btn-secondary">Change</button>
            </div>
          </div>
        </form>
      </article>

      <br>
      <br>

      <article>
        <h3>Invite employee</h3>
        <button id="invite" class="btn btn-dark">Generate invite</button>

        <div id="invite-modal" class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <label for="invite-url" class="modal-title">
                  Invite URL
                </label>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span>&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <div class="input-group has-validation">
                  <input id="invite-url" class="form-control" type="text" readonly>
                  <div class="input-group-append">
                    <button id="copy-invite-url" class="btn btn-outline-secondary" type="button">
                      <i class="bi bi-clipboard2-fill"></i>
                    </button>
                  </div>
                  <div class="valid-tooltip">
                    Copied!
                  </div>
                  <div id="copy-failed" class="invalid-tooltip">
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </article>

    </div>
  </div>

</main>

<!-- Popper.JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
        integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
        crossorigin="anonymous"></script>
<!-- Bootstrap JS -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
        integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
        crossorigin="anonymous"></script>

<script type="module" src="profile/profile.js"></script>
</body>

</html>
