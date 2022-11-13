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
require "../backend/users.php";
require "../php/params.php";
require_once "../php/error.php";

header('Content-Type: application/json');

// LEFT_COMPANY?
enum ErrorReason: string
{
  case WRONG_PASSWORD = 'WRONG_PASSWORD';
  case DOESNT_EXIST = 'DOESNT_EXIST';
}

require_and_unpack_params([
  'email' => &$email,
  'password' => &$password,
]);

// TODO: check email domain
// TODO: check password aligns with policy

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
