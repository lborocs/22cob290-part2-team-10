<?php
// https://getbootstrap.com/docs/5.0/content/reboot/#forms
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Make-It-All</title>
    <link rel="icon" type="image/png" href="make_it_all.png">

    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">

    <link rel="stylesheet" type="text/css" href="index.css">
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
  <div class="">
    <img src="make_it_all.png" alt="Make It All Logo" class="mb-4">
    <form class="mt-6">
      <div class="form-group row my-3">
        <label for="email" class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-9">
          <input type="email" class="form-control" id="email" name="email" placeholder="Enter email">
        </div>
      </div>

      <div class="form-group row my-3">
        <label for="password" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-9">
          <input type="password" class="form-control" id="password" name="password" placeholder="Password">
        </div>
      </div>

      <div class="form-group row">
        <div class="d-flex justify-content-center">
          <button type="submit" id="submitBtn" class="btn btn-secondary">Login</button>
        </div>
      </div>
    </form>
  </div>
</div>
</main>

<!-- Bootstrap JS Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>

<script src="index.js"></script>
</body>
</html>
