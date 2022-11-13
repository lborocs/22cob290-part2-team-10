<?php

require_once "error.php";

function require_and_unpack_params(array $params): void
{
  foreach ($params as $param => &$variable) {
    if (!isset($_REQUEST[$param])) {
      http_response_code(300);
      error('Not all params set.');
    }

    $variable = $_REQUEST[$param];
  }
}
