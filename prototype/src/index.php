<?php

require "php/credentials.php";

if (cookie_is_set()) {
  // redirect to home page if already logged in
  header('Location: http://team10.sci-project.lboro.ac.uk/t10/home', true, 303);
  die();
}

// TODO: allow signing up from here
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Make-It-All</title>
  <link rel="icon" type="image/png" href="assets/make_it_all.png">

  <!-- jQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.min.css">

  <link rel="stylesheet" type="text/css" href="login/styles.css">
</head>

<body>
<main class="vh-100 d-flex align-items-center justify-content-center">
  <div>
    <img src="assets/make_it_all.png" alt="Make-It-All Logo" class="img-fluid mb-3">

    <form id="login-form" action="login/action.php" method="POST" class="mt-6">
      <!-- Email -->
      <div class="form-group row mb-3">
        <label for="email" class="col-sm-3 col-form-label">Email</label>
        <div class="col-sm-9 position-relative">
          <!-- value="alice@make-it-all.co.uk" -->
          <input type="email"
                 value="@make-it-all.co.uk"
                 autocomplete="email"
                 class="form-control"
                 id="email"
                 name="email"
                 placeholder="Enter email"
                 required
                 >
          <div id="email-feedback" class="invalid-tooltip">
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="form-group row mb-3">
        <label for="password" class="col-sm-3 col-form-label">Password</label>
        <div class="col-sm-9 position-relative">
          <div class="input-group has-validation">
            <!-- value="TestPassword123!" -->
            <input type="password"
                   value=""
                   autocomplete="current-password"
                   class="form-control"
                   id="password"
                   name="password"
                   placeholder="Enter password"
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
            <div id="password-feedback" class="invalid-tooltip">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="d-flex justify-content-center">
          <button id="login-btn" type="submit" class="btn btn-secondary">Login</button>
        </div>
      </div>
    </form>

  </div>
</main>

<!-- Bootstrap JS Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>

<script type="module" src="login/script.js"></script>
</body>
</html>
