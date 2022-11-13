<?php

// hardcoded

function get_managed_projects(string $email): array
{
  $result = array_map(fn($num): array => [
    'name' => "Project $num",
    'completed' => rand(10, 100),
    'total' => 100,
  ], range(1, 8));

  // for demo
  array_unshift($result, [
    'name' => 'Complete Project',
    'completed' => 100,
    'total' => 100,
  ]);

  return $result;
}

// will this just be all the staff assigned to all the projects the manager manages?
function get_managed_staff(string $email): array
{
  $result = array_map(fn($num): array => [
    'name' => "Subordinate $num", // we might want their email not name?
    'completed' => rand(10,100),
    'total' => 100,
  ], range(1, 8));

  // for demo
  array_unshift($result, [
    'name' => 'Productive employee',
    'completed' => 100,
    'total' => 100,
  ]);

  return $result;
}
