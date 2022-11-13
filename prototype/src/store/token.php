<?php

function generate_token(string $email): string
{
  return 'a-token';
}

function token_has_been_used(string $token): bool
{
  return $token === 'used-token';
}
