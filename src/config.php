<?php
require_once  __DIR__ . '/../app/bootstrap.php';

use Noodlehaus\Config;
use Perrich\HttpHelper;

$conf = Config::load(__DIR__ . '/../app/config.json');

$jsConfiguration = [
    'WS_refreshDelayMs' => $conf->get('WS_refreshDelayMs'),
    'WS_baseUrl' => $conf->get('WS_baseUrl'),
	'maxHoldingDelayInHours' => $conf->get('warning_mail.maxHoldingDelayInHours'),
	'myOldResourcesCheckDelayInMinutes' => $conf->get('myOldResourcesCheckDelayInMinutes'),
];

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
	// Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
	// you want to allow, and if so:
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

HttpHelper::jsonContent($jsConfiguration);