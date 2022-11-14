<?php

// TODO: make into static util-like class

const COOKIE_NAME = 'email_credential';
const COOKIE_LEN = 60 * 60; // 1 hour

function cookie_is_set(): bool
{
  return isset($_COOKIE[COOKIE_NAME]);
}

// maybe not use, remove?
function remove_cookie(): void
{
  unset($_COOKIE[COOKIE_NAME]);
  setcookie(COOKIE_NAME, null, -1, '/');
}

function set_credentials(string $email): void
{
  $cookie_value = $email;
  $expiry = time() + COOKIE_LEN;
  setcookie(COOKIE_NAME, $cookie_value, $expiry, '/');
}

function require_and_get_email(bool $redirect = true): string
{
  if (!cookie_is_set()) {
    if ($redirect) {
      // redirect to login page if not signed in
      header('Location: http://team10.sci-project.lboro.ac.uk/t10/', true, 303);
      die();
    } else {
      require_once "error.php";
      error('No essential cookie detected', 401);
    }
  }

  return $_COOKIE[COOKIE_NAME];
}
