<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - password [string]
 *
 * Response schema:
 *  - success [boolean]
 *  - role [Role, if success == true]
 *  - errorMessage [ErrorReason, if success == false]
 */

require "../credentials.php";

header('Content-Type: application/json');

enum Role: string
{
  case MANAGER = 'MANAGER';
  case TEAM_LEADER = 'TEAM_LEADER';
  case TEAM_MEMBER = 'TEAM_MEMBER';
  case LEFT_COMPANY = 'LEFT_COMPANY';
}

// LEFT_COMPANY?
enum ErrorReason: string
{
  case WRONG_PASSWORD = 'WRONG_PASSWORD';
  case DOESNT_EXIST = 'DOESNT_EXIST';
}

function error(string|ErrorReason $error): void
{
  $errorMessage = is_string($error) ? $error : $error->value;

  exit(json_encode([
    'success' => false,
    'errorMessage' => $errorMessage,
  ]));
}

function get_user(string $email): ?array
{
  // hardcoded
  $staff = [
    [
      'email' => 'alice@make-it-all.co.uk',
      'password' => 'TestPassword123!',
      'role' => Role::TEAM_MEMBER,
    ],
    [
      'email' => 'john@make-it-all.co.uk',
      'password' => 'TestPassword123!',
      'role' => Role::TEAM_LEADER,
    ],
    [
      'email' => 'james@make-it-all.co.uk',
      'password' => 'TestPassword123!',
      'role' => Role::MANAGER,
    ],
    [
      'email' => 'olivia@make-it-all.co.uk',
      'password' => 'TestPassword123!',
      'role' => Role::LEFT_COMPANY,
    ],
  ];

  foreach ($staff as $user) {
    if ($user['email'] == $email) {
      return $user;
    }
  }

  return null;
}

if (!isset($_REQUEST['email'])
  || !isset($_REQUEST['password'])) {
  error('Not all params set.');
}

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];

// TODO: check email domain
// TODO: check password aligns with policy
// TODO: ask if max pw length of 20 is OK

$response = [
  'success' => false,
];

$user = get_user($email);

if ($user) {
  $correct_password = $password == $user['password'];
  if ($correct_password) {
    $response['success'] = true;
    $response['role'] = $user['role']->value;
  } else {
    $response['errorMessage'] = ErrorReason::WRONG_PASSWORD->value;
  }
} else {
  $response['errorMessage'] = ErrorReason::DOESNT_EXIST->value;
}

/*
try {
  $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // count will tell us if there is a user with that email
  // correct_password will tell us that the password entered is correct
  // TODO verify works
  $sql = <<<SQL
    SELECT
      COUNT(*) AS count,
      users.password = $password AS correct_password
    FROM
      users
    WHERE
      users.email = $email
  SQL;

  $statement = $conn->query($sql);

  $result = $statement->fetchAll(PDO::FETCH_ASSOC);

  // maybe I need to check if $result is empty
  $exists = $result['count'] > 0;
  $correct_password = $result['correct_password']; // TODO: think i need to convert to bool

  $response['success'] = $exists && $correct_password;

  $conn = null;
} catch(PDOException $e) {
  $response['success'] = false;
  $response['errorMessage'] = "Connection failed: " . $e->getMessage();
  unset($response['results']);
}
*/

echo json_encode($response);
