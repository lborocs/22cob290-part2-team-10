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

require "../credentials.php";
require "../backend/users.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case ALREADY_EXIST = 'ALREADY_EXIST';
  case INVALID_TOKEN = 'INVALID_TOKEN';
  case USED_TOKEN = 'USED_TOKEN';
}

function error(string|ErrorReason $error): void
{
  $errorMessage = is_string($error) ? $error : $error->value;

  exit(json_encode([
    'success' => false,
    'errorMessage' => $errorMessage,
  ]));
}

// hardcoded
// move to /backend?
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

if (!isset($_REQUEST['email'])
  || !isset($_REQUEST['password'])) {
  error('Not all params set.');
}

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
$token = $_REQUEST['token'];

$exists = get_user($email) != null;

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