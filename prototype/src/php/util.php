<?php

class Util
{
  public static function is_make_it_all_email(string $email): bool
  {
    return str_ends_with($email, '@make-it-all.co.uk');
  }

  public static function meets_password_policy(string $password): bool
  {
    $len = strlen($password);
    if ($len < 12 || $len > 64) {
      return false;
    }

    // same as js
    $LOWERCASE_REGEX = '/(?=.*[a-z])/';
    $UPPERCASE_REGEX = '/(?=.*[A-Z])/';
    $NUMBER_REGEX = '/(?=.*\d)/';
    $SPECIAL_SYMBOL_REGEX = '/(?=.*\W)/';

    if (preg_match($LOWERCASE_REGEX, $password) !== 1)
      return false;

    if (preg_match($UPPERCASE_REGEX, $password) !== 1)
      return false;

    if (preg_match($NUMBER_REGEX, $password) !== 1)
      return false;

    if (preg_match($SPECIAL_SYMBOL_REGEX, $password) !== 1)
      return false;

    return true;
  }
}
