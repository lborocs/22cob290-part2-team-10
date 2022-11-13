<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - currentPassword [string]
 *  - newPassword [string]
 *
 * Response schema:
 *  - success [boolean]
 *  - errorMessage [ErrorReason, if success == false]
 */

require "../credentials.php";
require "../store/users.php";
require "../php/params.php";
require_once "../php/error.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case WRONG_PASSWORD = 'WRONG_PASSWORD';
  case DOESNT_EXIST = 'DOESNT_EXIST';
}

require_and_unpack_params([
  'email' => &$email,
  'currentPassword' => &$currentPassword,
  'newPassword' => &$newPassword,
]);

$user = get_user($email);

if ($user === null) {
  error(ErrorReason::DOESNT_EXIST);
}

if ($currentPassword !== $user['password']) {
  error(ErrorReason::WRONG_PASSWORD);
}

change_password($email, $newPassword);

echo json_encode([
  'success' => true,
]);
