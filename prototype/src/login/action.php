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

header('Content-Type: application/json');

// LEFT_COMPANY?
enum ErrorReason: string
{
  case WRONG_PASSWORD = 'WRONG_PASSWORD';
  case DOESNT_EXIST = 'DOESNT_EXIST';
}

function error(string|ErrorReason $error): void
{
  $errorMessage = is_string($error) ? $error : $error->value;

  exit(json_encode([
    'success' => false,
    'errorMessage' => $errorMessage,
  ]));
}

require_and_unpack_params([
  'email' => &$email,
  'password' => &$password,
]);

// TODO: check email domain
// TODO: check password aligns with policy

$response = [
  'success' => false,
];

$user = get_user($email);

if ($user) {
  $correct_password = $password == $user['password'];
  if ($correct_password) {
    $response['success'] = true;
    $response['role'] = $user['role']->value;
  } else {
    $response['errorMessage'] = ErrorReason::WRONG_PASSWORD->value;
  }
} else {
  $response['errorMessage'] = ErrorReason::DOESNT_EXIST->value;
}

echo json_encode($response);
