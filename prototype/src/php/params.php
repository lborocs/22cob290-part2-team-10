<?php

function require_and_unpack_params(array $params): void
{
  foreach ($params as $param => &$variable) {
    if (!isset($_REQUEST[$param])) {
      error('Not all params set.');
    }

    $variable = $_REQUEST[$param];
  }
}
