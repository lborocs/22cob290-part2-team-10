<?php

function error(string|BackedEnum $error, ?int $response_code = null): void
{
  $error_message = is_string($error) ? $error : $error->value;

  if (!is_null($response_code)) {
    http_response_code($response_code);
  }

  exit(json_encode([
    'success' => false,
    'errorMessage' => $error_message,
  ]));
}
