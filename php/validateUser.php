<?php
	// https://stackoverflow.com/questions/5647461/how-do-i-send-a-post-request-with-php

	require 'privateData.php';
	
	$url = 'https://www.google.com/recaptcha/api/siteverify';
	$data = array('secret' => $privateRecaptchaKey, 'response' => $_REQUEST["token"]);
	
	$options = array(
		'http' => array(
			'header' => "Content-type: application/x-www-form-urlencoded\r\n",
			'method' => 'POST',
			'content' => http_build_query($data)
		)
	);
	$context = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	
	if ($result === FALSE) {
		$errMsg = ["errMessage" => "PHP function file_get_contents could not connect to reCaptcha validation servers"];
		echo json_encode($errMsg, JSON_UNESCAPED_SLASHES);
		return;
	}
	
	$data = json_decode($result, true);
	$success = $data["success"];
	
	if ($success) {
		echo json_encode($realData, JSON_UNESCAPED_SLASHES);
	}
	else {
		echo json_encode($fakeData, JSON_UNESCAPED_SLASHES);
	}
?>