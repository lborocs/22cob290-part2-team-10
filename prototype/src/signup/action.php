<?php
/*
 * Parameters schema:
 *  - email [string]
 *  - password [string]
 *  - token [JWT token (string)]
 *
 * Response schema:
 *  - success [boolean]
 *  - errorMessage [enum, if success == false] ALREADY_EXIST, INVALID_TOKEN, USED_TOKEN ...
 */

require "../credentials.php";

header('Content-Type: application/json');

function error(string $errorMessage)
{
  exit(json_encode([
    'success' => false,
    'errorMessage' => $errorMessage,
  ]));
}

// hardcoded
function decrypt_token(string $token): ?string
{
  $valid_tokens = [
    'a-token',
    'used-token',
  ];

  if (in_array($token, $valid_tokens)) {
    return 'alice@make-it-all.co.uk';
  }

  return null;
}

function token_has_been_used(string $token): bool
{
  return $token === 'used-token';
}

if (!isset($_REQUEST['email'])
  || !isset($_REQUEST['password'])) {
  error('Not all params set.');
}

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
$token = $_REQUEST['token'];

$exists = $email == 'alice@make-it-all.co.uk';

if ($exists) {
  error('ALREADY_EXIST');
}

$inviter = decrypt_token($token);
if ($inviter === null) {
  error('INVALID_TOKEN');
}

if (token_has_been_used($token)) {
  error('USED_TOKEN');
}

$response = [
  'success' => true,
];

/*
function used_token(PDO $conn, string $token): bool
{
  $sql = <<<SQL
    SELECT
      COUNT(*) AS count
    FROM
      users
    WHERE
      users.invite_token = $token
  SQL;

  $statement = $conn->query($sql);

  $result = $statement->fetch(PDO::FETCH_ASSOC);

  $count = $result['count'];

  return $count > 0;
}

try {
  $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if (used_token(conn, token)) {
    $conn = null;
    error('USED_TOKEN');
  }

  $sql = <<<SQL
    INSERT IGNORE INTO users
    VALUES ($username, $password, $token)
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
