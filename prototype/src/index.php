<?php
// TODO check if they're already logged in - don't really need to?
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Make-It-All</title>
  <link rel="icon" type="image/png" href="login/assets/make_it_all.png">

  <!-- jQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

  <link rel="stylesheet" type="text/css" href="login/css/index.css">
</head>

<body>
<main class="vh-100 d-flex align-items-center justify-content-center">
  <div>
    <img src="assets/make_it_all.png" alt="Make It All Logo" class="mb-4">

    <form id="login-form" action="login/login.php" method="POST" class="mt-6">
      <div class="form-group row login-form-row">
        <label for="email" class="col-sm-3 col-form-label">Email</label>
        <div class="col-sm-9">
          <input value="alice@make-it-all.co.uk"
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
            You do not have an account!
          </div>
        </div>
      </div>

      <div class="form-group row login-form-row">
        <div class="col-sm-3 d-flex flex-row align-items-center">
          <label for="password" class="col-form-label">Password</label>
          <span class="mx-2 d-inline-block multiline-tooltip"
                tabindex="0"
                data-toggle="tooltip"
                title="At least 1 uppercase<br>At least 1 lowercase<br>At least 1 number<br>At least 1 special symbol"
                >
            <i class="bi bi-info-circle-fill"></i>
          </span>
        </div>
        <!-- pw pattern: https://stackoverflow.com/q/1559751
          pw pattern not working here but works in js
          (?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)

          add .* and it works here
        -->
        <div class="col-sm-9">
          <div class="input-group has-validation">
            <input value="TestPassword123!"
                   type="password"
                   autocomplete="current-password"
                   class="form-control"
                   id="password"
                   name="password"
                   placeholder="Password"
                   minlength="12"
                   required
                   >
            <button id="toggle-password" class="btn btn-outline-secondary" type="button">
              <i id="eye" class="bi bi-eye-fill"></i>
            </button>
            <div id="password-feedback" class="invalid-feedback">
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

<script type="module" src="login/js/index.js"></script>
</body>
</html>
