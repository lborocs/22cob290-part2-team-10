<?php

enum Role: string
{
  case MANAGER = 'MANAGER';
  case TEAM_LEADER = 'TEAM_LEADER';
  case TEAM_MEMBER = 'TEAM_MEMBER';
  case LEFT_COMPANY = 'LEFT_COMPANY';
}

// hardcoded
$staff = [
  [
    'email' => 'alice@make-it-all.co.uk',
    'password' => 'TestPassword123!',
    'role' => Role::TEAM_MEMBER,
  ],
  [
    'email' => 'member@make-it-all.co.uk',
    'password' => 'TestPassword123!',
    'role' => Role::TEAM_MEMBER,
  ],
  [
    'email' => 'leader@make-it-all.co.uk',
    'password' => 'TestPassword123!',
    'role' => Role::TEAM_LEADER,
  ],
  [
    'email' => 'manager@make-it-all.co.uk',
    'password' => 'TestPassword123!',
    'role' => Role::MANAGER,
  ],
  [
    'email' => 'left@make-it-all.co.uk',
    'password' => 'TestPassword123!',
    'role' => Role::LEFT_COMPANY,
  ],
];

function get_all_emails(): array
{
  global $staff;

  return array_map(fn($emp): string => $emp['email'], $staff);
}

// TODO: rename?
function get_all_emails_not_left(): array
{
  global $staff;

  $not_left = array_filter($staff, fn($emp): bool => $emp['role'] != Role::LEFT_COMPANY);

  return array_map(fn($emp): string => $emp['email'], $not_left);
}

function get_user(string $email): ?array
{
  global $staff;

  foreach ($staff as $user) {
    if ($user['email'] == $email) {
      return $user;
    }
  }

  return null;
}

function add_user(string $email, string $password, string $token): void
{
  // add to database
}

function token_has_been_used(string $token): bool
{
  return $token == 'used-token';
}
