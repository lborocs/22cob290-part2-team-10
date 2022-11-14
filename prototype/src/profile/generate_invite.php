<?php
/*
 * Parameters schema:
 *  - email [string]
 *
 * Response schema:
 *  - token [string]
 */

require "../store/token.php";
require "../php/credentials.php";
require_once "../php/error.php";

header('Content-Type: application/json');

enum ErrorReason: string
{
  case UNKNOWN = 'UNKNOWN';
}

$email = require_and_get_email(false);

// maybe generate_token should be here?
$token = generate_token($email);

echo json_encode([
  'token' => $token,
]);
