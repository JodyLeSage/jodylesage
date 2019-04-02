<?php
/**
 * GitHub webhook handler template.
 * 
 * @see  https://developer.github.com/webhooks/
 * @author  Miloslav Hůla (https://github.com/milo)
 */

$hookSecret = $_SERVER['GITHUB_WEBHOOK_TOKEN'];

set_error_handler(function($severity, $message, $file, $line) {
	throw new \ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function($e) {
	header('HTTP/1.1 500 Internal Server Error');
	echo "Error on line {$e->getLine()}: " . htmlSpecialChars($e->getMessage());
	die();
});

$rawPost = NULL;

if ($hookSecret !== NULL) {
	if (!isset($_SERVER['HTTP_X_HUB_SIGNATURE'])) {
		throw new \Exception("HTTP header 'X-Hub-Signature' is missing.");
	} elseif (!extension_loaded('hash')) {
		throw new \Exception("Missing 'hash' extension to check the secret code validity.");
	}
	list($algo, $hash) = explode('=', $_SERVER['HTTP_X_HUB_SIGNATURE'], 2) + array('', '');
	if (!in_array($algo, hash_algos(), TRUE)) {
		throw new \Exception("Hash algorithm '$algo' is not supported.");
	}
	$rawPost = file_get_contents('php://input');
	if (!hash_equals($hash, hash_hmac($algo, $rawPost, $hookSecret))) {
		throw new \Exception('Hook secret does not match.');
	}
};

if (!isset($_SERVER['CONTENT_TYPE'])) {
	throw new \Exception("Missing HTTP 'Content-Type' header.");
} elseif (!isset($_SERVER['HTTP_X_GITHUB_EVENT'])) {
	throw new \Exception("Missing HTTP 'X-Github-Event' header.");
}

switch ($_SERVER['CONTENT_TYPE']) {
	case 'application/json':
		$json = $rawPost ?: file_get_contents('php://input');
		break;
	case 'application/x-www-form-urlencoded':
		$json = $_POST['payload'];
		break;
	default:
		throw new \Exception("Unsupported content type: $_SERVER[HTTP_CONTENT_TYPE]");
}

$payload = json_decode($json);
switch (strtolower($_SERVER['HTTP_X_GITHUB_EVENT'])) {
	case 'ping':
		echo 'pong';
		break;
	case 'push':
		/*exec( 'cd /srv/www/jodylesage.com/ && git pull', $output, $returncode );
		echo $returncode;
		print_r($output);

		if (is_null($output)) {
			throw new \Exception("git commands did not execute properly");
		}*/

		$commands = array(
			'echo $PWD',
			'whoami',
			'git pull',
			'git status',
			'git submodule sync',
			'git submodule update',
			'git submodule status',
		);
		// Run the commands for output
		$output = '';
		foreach($commands AS $command){
			// Run it
			$tmp = shell_exec($command);
			// Output
			$output .= "<span style=\"color: #6BE234;\">\$</span> <span style=\"color: #729FCF;\">{$command}\n</span>";
			$output .= htmlentities(trim($tmp)) . "\n";
		}
	break;
	default:
		header('HTTP/1.0 404 Not Found');
		echo "Event:$_SERVER[HTTP_X_GITHUB_EVENT] Payload:\n";
		print_r($payload); # For debug only. Can be found in GitHub hook log.
		die();
	// Make it pretty for manual user access (and why not?)
?>
<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>GIT DEPLOYMENT SCRIPT</title>
</head>
<body style="background-color: #000000; color: #FFFFFF; font-weight: bold; padding: 0 10px;">
<pre>
 .  ____  .    ____________________________
 |/      \|   |                            |
[| <span style="color: #FF0000;">&hearts;    &hearts;</span> |]  | Git Deployment Script v0.1 |
 |___==___|  /              &copy; oodavid 2012 |
              |____________________________|

<?php echo $output; ?>
</pre>
</body>
</html>
