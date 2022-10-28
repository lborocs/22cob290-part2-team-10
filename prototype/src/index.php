<?php
// https://getbootstrap.com/docs/5.0/content/reboot/#forms
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

    <link rel="stylesheet" type="text/css" href="css/index.css">
</head>

<body>
<!-- <header>
  <div>
    <div>
      <img src="make_it_all.png" alt="Make It All Logo">
    </div>
  </div>
  <h1 class="text-black center">Make-It-All</h1>
</header> -->

<main>
<div class="vh-100 d-flex align-items-center justify-content-center">
  <div>
    <img src="assets/make_it_all.png" alt="Make It All Logo" class="mb-4">

    <form id="login-form" class="mt-6">
      <div class="form-group row my-3">
        <label for="email" class="col-sm-3 col-form-label">Email</label>
        <div class="col-sm-9">
          <input value="alice@make-it-all.co.uk" type="email" class="form-control" id="email" name="email" placeholder="Enter email">
        </div>
      </div>

      <div class="form-group row my-3">
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

        <!-- <label for="password" class="col-sm-2 col-form-label">Password</label> -->
        <div class="col-sm-9">
          <!-- https://stackoverflow.com/q/1559751 pattern not working -->
          <input value="TestPassword123!"
                 type="password"
                 class="form-control"
                 id="password"
                 name="password"
                 placeholder="Password"
                 minlength="12"
                 pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)"
          >
        </div>
      </div>

      <div class="form-group row">
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-secondary">Login</button>
        </div>
      </div>
    </form>

  </div>
</div>
</main>

<!-- Bootstrap JS Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>

<script src="js/index.js"></script>
</body>
</html>
