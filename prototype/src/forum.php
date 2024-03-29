<?php

// FIXME: collapsing toolbar isn't animated when on mobile

require "store/users.php";
require "php/credentials.php";

$email = require_and_get_email();
$user = get_user($email);
$role = $user['role'];
?>

<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forum</title>
      <!-- Bootstrap links and scripts -->
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous"
      >
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
        integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
        crossorigin="anonymous"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
        integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
        crossorigin="anonymous"
      ></script>
      <!-- Font Awesome JS -->
      <script
        defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
        integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
        crossorigin="anonymous"
      ></script>
      <script
        defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js"
        integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY"
        crossorigin="anonymous"
      ></script>
      <!-- jQuery -->
      <script
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"
      ></script>
      <!-- Forum style -->
      <link rel="stylesheet" href="forum/forum.css">
    </head>
    <body>
      <div
        id="commentEditor" class="modal fade" tabindex="-1"
        aria-labelledby="commentEditor"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">New Post</h5>
              <button
                class="fa fa-times" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close" type="button"
              ></button>
            </div>

            <div class="modal-body">
              <form onsubmit="add_post(this, event)">
                <p>
                  End every topic with a comma, to add them to your post's
                  topic roster.
                </p>
                <input
                  type="text" class="textField" id="postTitle"
                  placeholder="Your title..." required
                >
                <textarea
                  id="postText" class="textField" placeholder="Your post..."
                  rows="3" required
                ></textarea>
                <input
                  type="text" class="textField" id="postTopicsText"
                  placeholder="Enter a topic" onkeyup="add_tag_to_post()"
                >
                <div id="postTopics" class="row">
                </div>
                <br>
                <button type="submit" id="post">Post</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <main class="wrapper">
        <!-- Sidebar -->
        <nav id="sidebar" class="">
          <div class="sidebar-header">
            <img
              src="assets/company-logo.png" alt="company logo"
              id="company-logo"
            >
          </div>

          <div class="container">
            <div id="leftMain" class="container-fluid">
              <div class="row centeredDiv">
                <input
                  id="searchField" type="search" class="darkGrey textField"
                  placeholder="Search By Title..." onsearch="get_posts()"
                >
              </div>

              <div class="row centeredDiv container-fluid">
                <div id="filterPrompt" class="row">
                    <p>Filter By Topic:</p>
                </div>
                <div id="filterOptions" class="row">
                </div>
              </div>

              <div class="row centeredDiv">
                <button
                  id="newPost" type="button" class="mb-3"
                  data-bs-toggle="modal"
                  data-bs-target="#commentEditor"
                ><i class='fa fa-plus'></i> New Post</button>
              </div>
            </div>
          </div>
        </nav>

        <div id="content" class="container-fluid">
          <nav class="navbar navbar-expand-lg">
            <button
              type="button" id="sidebarCollapse"
              class="sidebar-toggle-btn"
            >
              <i class="fas fa-align-left"></i>
              <span>Toggle Sidebar</span>
            </button>
            <button
              id="navbarCollapse" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation"
            ><i class="fas fa-align-justify"></i></button>
            <div
              id="navbarSupportedContent"
              class="container-flex collapse navbar-collapse"
            >
              <ul class="nav navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link" href="home">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active">Forum</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="projects">
                    Projects
                  </a>
                </li>
                <?php if ($role === Role::MANAGER): ?>
                  <li class="nav-item">
                    <a class="nav-link" href="dashboard">Dashboard</a>
                  </li>
                <?php endif ?>
                <li class="nav-item">
                  <a href="profile">
                    <span class="nav-link d-lg-none d-md-block">Profile</span>
                    <span class="text-avatar d-none d-lg-block">
                      <?= strtoupper($email[0]) ?>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div id="main" class="container">
            <div id="rightMain" class="container-fluid">
              <div id="resultCounter" class="row">
                <h5 id="counter">No comments were found</h5>
              </div>
              <div id="commentBoard" class="row">
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Forum script -->
      <script type="module" src="forum/forum.js"></script>
    </body>
  </html>
