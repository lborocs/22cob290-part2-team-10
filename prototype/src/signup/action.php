<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - password [string]
 *  - token [JWT token (string)]
 *
 * Response schema:
 *  - success [boolean]
 *  - role [Role::TEAM_MEMBER]
 *  - errorMessage [ErrorReason, if success == false]
 */

require "../store/users.php";
require "../store/token.php";
require "../php/params.php";
require_once "../php/error.php";
require_once "../php/util.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case ALREADY_EXIST = 'ALREADY_EXIST';
  case INVALID_TOKEN = 'INVALID_TOKEN';
  case USED_TOKEN = 'USED_TOKEN';
  case BAD_CREDENTIALS = 'BAD_CREDENTIALS';
}

// hardcoded
// move to /store?
function decrypt_token(string $token): ?string
{
  $valid_tokens = [
    'a-token',
    'used-token',
  ];

  if (in_array($token, $valid_tokens)) {
    return 'alice@make-it-all.co.uk';
  }

  return null;
}

require_and_unpack_params([
  'email' => &$email,
  'password' => &$password,
  'token' => &$token,
]);

if (!Util::is_make_it_all_email($email)) {
  error(ErrorReason::BAD_CREDENTIALS);
}

if (!Util::meets_password_policy($password)) {
  error(ErrorReason::BAD_CREDENTIALS);
}

$exists = get_user($email) !== null;

if ($exists) {
  error(ErrorReason::ALREADY_EXIST);
}

$inviter = decrypt_token($token);
if ($inviter === null) {
  error(ErrorReason::INVALID_TOKEN);
}

if (token_has_been_used($token)) {
  error(ErrorReason::USED_TOKEN);
}

add_user($email, $password, $token);

$response = [
  'success' => true,
  'role' => Role::TEAM_MEMBER->value,
];

echo json_encode($response);
