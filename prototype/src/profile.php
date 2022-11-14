<?php

// converted to bootstrap 5

require "store/users.php";
require "store/projects.php";
require "php/credentials.php";

$email = require_and_get_email();
$user = get_user($email);
$role = $user['role'];

$is_manager = $role === Role::MANAGER;

$projects = get_project_names($email);

// TODO: text avatar colors (bg & text)

// TODO: sign out button deletes cookie

?><!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Profile</title>

  <!-- jQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

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
      <p>Assigned Projects:</p>
      <ul class="list-unstyled" id="projects-list">
        <?php
        foreach ($projects as $project_name) {
          echo <<<HTML
            <li>
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
        <button class="btn btn-dark d-inline-block d-lg-none ms-auto" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
          <i class="fas fa-align-justify"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="nav navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="forum">Forum</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="projects">Projects</a>
            </li>
            <?php if ($is_manager): ?>
              <li class="nav-item">
                <a class="nav-link" href="dashboard">Dashboard</a>
              </li>
            <?php endif ?>
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

      <section>
        <div class="row">
          <div class="col">
            <h3>Email</h3>
            <span><?= $email ?></span>
          </div>
          <div class="col">
            <h3>Role</h3>
            <span><?= $role->value ?></span>
          </div>
        </div>
      </section>

      <br>
      <br>

      <section>
        <h3>Change Password</h3>
        <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#change-pw-modal">Change</button>

        <div id="change-pw-modal" class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">Change Password</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
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
                    <label for="currentPassword" class="col-sm-3 col-form-label">Current Password</label>
                    <div class="col-sm-9">
                      <div class="input-group has-validation position-relative">
                        <!-- value="TestPassword123!" -->
                        <input type="password"
                               value=""
                               autocomplete="current-password"
                               class="form-control"
                               id="currentPassword"
                               name="currentPassword"
                               placeholder="Enter current password"
                               minlength="12"
                               maxlength="64"
                               required
                               >
                        <span class="input-group-text d-inline-block multiline-tooltip"
                              tabindex="0"
                              data-bs-toggle="tooltip"
                              title="At least 1 uppercase<br>At least 1 lowercase<br>At least 1 number<br>At least 1 special symbol"
                              >
                          <i class="bi bi-info-circle-fill"></i>
                        </span>
                        <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                          <i class="bi bi-eye-fill eye"></i>
                        </button>
                        <div id="currentPassword-feedback" class="invalid-tooltip">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- New password -->
                  <div class="form-group row mb-3">
                    <label for="newPassword" class="col-sm-3 col-form-label">New Password</label>
                    <div class="col-sm-9">
                      <div class="input-group has-validation position-relative">
                        <input type="password"
                               value=""
                               autocomplete="new-password"
                               class="form-control"
                               id="newPassword"
                               name="newPassword"
                               placeholder="Enter new password"
                               minlength="12"
                               maxlength="64"
                               required
                               >
                        <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                          <i class="bi bi-eye-fill eye"></i>
                        </button>
                        <div id="newPassword-feedback" class="invalid-tooltip">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Confirm password -->
                  <div class="form-group row mb-3">
                    <label for="confirm" class="col-sm-3 col-form-label">Confirm Password</label>
                    <div class="col-sm-9">
                      <div class="input-group has-validation position-relative">
                        <input type="password"
                               autocomplete="new-password"
                               class="form-control"
                               id="confirm"
                               name="confirm"
                               placeholder="Enter new password again"
                               minlength="12"
                               maxlength="64"
                               required
                               >
                        <button class="btn btn-outline-secondary toggle-password-btn" type="button">
                          <i class="bi bi-eye-fill eye"></i>
                        </button>
                        <div id="confirm-feedback" class="invalid-tooltip">
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                <button type="submit" form="change-pw-form" class="btn btn-primary btn-sm">Change</button>
              </div>
            </div>
          </div>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
          <div id="pw-changed-toast" class="toast" role="status" aria-live="polite" aria-atomic="true">
            <div class="toast-header">
              <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
                <rect width="100%" height="100%" fill="#198754"></rect>
              </svg>
              <strong class="me-auto">Success</strong>
              <small>Now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Password changed.
            </div>
          </div>
        </div>
      </section>

      <br>

      <section>
        <h3>Invite Employee</h3>
        <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#invite-modal">Generate invite</button>

        <div id="invite-modal" class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">
                  <label for="invite-url">Invite URL</label>
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
                <div class="input-group has-validation">
                  <input id="invite-url" class="form-control" type="text" readonly>
                  <button id="copy-invite-url" class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-clipboard2-fill"></i>
                  </button>
                  <div class="valid-feedback">Copied!</div>
                  <div id="copy-failed" class="invalid-feedback"></div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <br>
      <br>

      <button id="log-out-btn" class="btn btn-danger">Log out</button>

    </div>
  </div>

</main>

<!-- Popper.JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
        integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
        crossorigin="anonymous"></script>
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>

<script type="module" src="profile/profile.js"></script>
</body>

</html>
