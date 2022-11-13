<?php

require_once "error.php";

function require_and_unpack_params(array $params): void
{
  foreach ($params as $param => &$variable) {
    if (!isset($_REQUEST[$param])) {
      error('Not all params set.', 400);
    }

    $variable = $_REQUEST[$param];
  }
}
