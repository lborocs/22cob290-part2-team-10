<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - password [string]
 *
 * Response schema:
 *  - success [boolean]
 *  - errorMessage [ErrorReason, if success == false]
 */

require "../credentials.php";

header('Content-Type: application/json');

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

// hardcoded
$exists = $email == 'alice@make-it-all.co.uk';
$correct_password = $password == 'TestPassword123!';

if ($exists && $correct_password) {
  $response['success'] = true;
} else if ($exists) {
  $response['errorMessage'] = ErrorReason::WRONG_PASSWORD->value;
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
