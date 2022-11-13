<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - password [string]
 *
 * Response schema:
 *  - success [boolean]
 *  - role [Role, if success == true]
 *  - errorMessage [ErrorReason, if success == false]
 */

require "../credentials.php";
require "../store/users.php";
require "../php/params.php";
require_once "../php/error.php";
require_once "../php/util.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case WRONG_PASSWORD = 'WRONG_PASSWORD';
  case DOESNT_EXIST = 'DOESNT_EXIST';
  case BAD_CREDENTIALS = 'BAD_CREDENTIALS';
}

require_and_unpack_params([
  'email' => &$email,
  'password' => &$password,
]);

if (!Util::is_make_it_all_email($email)) {
  error(ErrorReason::BAD_CREDENTIALS);
}

if (!Util::meets_password_policy($password)) {
  error(ErrorReason::BAD_CREDENTIALS);
}

$user = get_user($email);

if (is_null($user)) {
  error(ErrorReason::DOESNT_EXIST);
}

if ($password != $user['password']) {
  error(ErrorReason::WRONG_PASSWORD);
}

$response = [
  'success' => true,
  'role' => $user['role']->value,
];

echo json_encode($response);
