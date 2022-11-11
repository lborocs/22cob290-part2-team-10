<?php

// hardcoded
function get_projects(string $email): array
{
  return array_map(fn($num): string => 'Project ' . $num, range(1, 15));
}
