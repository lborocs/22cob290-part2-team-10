<?php

// TODO: implement JWT token

// TODO: if token not set, show some sort of error page

// or if no token in URL, have an input for token

if (!isset($_REQUEST['token'])) {
  // die('Token not set');
}

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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

  <link rel="stylesheet" type="text/css" href="signup/styles.css">
</head>

<body>
<main class="vh-100 d-flex align-items-center justify-content-center">
  <div>
    <img src="assets/make_it_all.png" alt="Make It All Logo" class="mb-4">

    <form id="signup-form" action="signup/action.php" method="POST" class="mt-6">
      <div class="form-group row form-row">
        <label for="email" class="col-sm-3 col-form-label">Email</label>
        <div class="col-sm-9">
          <input value="bob@make-it-all.co.uk"
                 type="email"
                 autocomplete="email"
                 class="form-control"
                 id="email"
                 name="email"
                 placeholder="Enter email"
                 pattern=".+@make-it-all\.co\.uk"
                 required
                 >
          <div class="invalid-feedback">
            You already have an account!
          </div>
        </div>
      </div>

      <div class="form-group row form-row">
        <label for="password" class="col-sm-3 col-form-label">Password</label>
        <div class="col-sm-9">
          <div class="input-group has-validation">
            <input value="TestPassword456!"
                   type="password"
                   autocomplete="new-password"
                   class="form-control"
                   id="password"
                   name="password"
                   placeholder="Password"
                   minlength="12"
                   >
            <span class="input-group-text d-inline-block multiline-tooltip"
                  tabindex="0"
                  data-toggle="tooltip"
                  title="At least 1 uppercase<br>At least 1 lowercase<br>At least 1 number<br>At least 1 special symbol"
                  >
              <i class="bi bi-info-circle-fill"></i>
            </span>
            <button id="toggle-password" class="btn btn-outline-secondary" type="button">
              <i id="eye" class="bi bi-eye-fill"></i>
            </button>
            <div id="password-feedback" class="invalid-feedback">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row form-row">
        <label for="confirm" class="col-sm-3 col-form-label">Confirm Password</label>
        <div class="col-sm-9">
          <div class="input-group has-validation">
            <input value="TestPassword456!"
                   type="password"
                   autocomplete="new-password"
                   class="form-control"
                   id="confirm"
                   name="confirm"
                   placeholder="Password"
                   minlength="12"
                   >
            </span>
            <button id="toggle-confirm" class="btn btn-outline-secondary" type="button">
              <i id="confirm-eye" class="bi bi-eye-fill"></i>
            </button>
            <div id="confirm-feedback" class="invalid-feedback">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="d-flex justify-content-center">
          <button id="signup-btn" type="submit" class="btn btn-secondary">Sign Up</button>
        </div>
      </div>

    </form>
  </div>
</main>

<!-- Bootstrap JS Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>

<script type="module" src="signup/script.js"></script>
</body>
</html>
