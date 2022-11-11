<?php
/*
 * Parameters schema:
 *  - email [string]
 *
 * Response schema:
 *  - token [string]
 */

require "../backend/token.php";
require "../php/params.php";

enum ErrorReason: string
{
  case UNKNOWN = 'UNKNOWN';
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
]);

// maybe generate_token should be here?
$token = generate_token($email);

echo json_encode([
  'token' => $token,
]);
