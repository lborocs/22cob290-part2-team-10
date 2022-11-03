<?php
?><!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

  <title>Dashboard</title>
  <!-- Bootstrap CSS CDN -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
  <!-- Our Custom CSS -->
  <link rel="stylesheet" href="dashboard/style.css">

  <!-- Font Awesome JS -->
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
          integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
          crossorigin="anonymous"></script>
  <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js"
          integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY"
          crossorigin="anonymous"></script>
</head>

<body>
<main>
  <div class="sidebar">
    <div class="sidebar-header">
      <br>
      <img src="assets/company-logo.png" alt="company logo" id="company-logo">
    </div>
    <br>
    <p>Email:<br>johndoe@make-it-all.co.uk</p>


  </div>

  <div class="container">
    <nav class="navbar navbar-light bg-light">
      <span class="navbar-brand mb-0 h1">Manager Dashboard </span>
    </nav>
    <div class="scrolling-area">
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <h2>Complete projects</h2>
            <div class="scrollbar">
              <ul class="list-group">
                <li class="list-group-item">Project 1</li>
                <li class="list-group-item">Project 2</li>
                <li class="list-group-item">Project 3</li>
                <li class="list-group-item">Project 4</li>
                <li class="list-group-item">Project 5</li>
                <li class="list-group-item">Project 6</li>
                <li class="list-group-item">Project 7</li>
                <li class="list-group-item">Project 8</li>
                <li class="list-group-item">Project 9</li>
              </ul>

            </div>
          </div>

          <div class="col-sm">
            <h2>Staff Overview</h2>
            <div class="scrollbar">

              <ul class="list-group">
                <li class="list-group-item">Subordinate 1<span class="badge badge-light">31</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 2<span class="badge badge-light">3</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 3<span class="badge badge-light">4</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 4<span class="badge badge-light">23</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 5<span class="badge badge-light">24</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 6<span class="badge badge-light">25</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 7<span class="badge badge-light">11</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 8<span class="badge badge-light">15</span><span
                    class="badge badge-light">31</span></li>
                <li class="list-group-item">Subordinate 9<span class="badge badge-light">14</span><span
                    class="badge badge-light">31</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</main>
</body>

</html>
