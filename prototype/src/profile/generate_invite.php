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
require_once "../php/error.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case UNKNOWN = 'UNKNOWN';
}

require_and_unpack_params([
  'email' => &$email,
]);

// maybe generate_token should be here?
$token = generate_token($email);

echo json_encode([
  'token' => $token,
]);
