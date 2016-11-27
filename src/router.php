<?php
require_once  __DIR__ . '/../app/bootstrap.php';

use Phroute\Phroute\RouteCollector;
use Phroute\Phroute\Dispatcher;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Perrich\RouteDataProvider;
use Perrich\HandlerResolver;


// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
	// Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
	// you want to allow, and if so:
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS");         

	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

	exit(0);
}

session_start();

$log = new Logger('ROUTER');
$log->pushHandler(new StreamHandler($conf->get('logfile'), Logger::DEBUG));

$provider = new RouteDataProvider();

try {
	$prefix = basename(__FILE__);
	$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
	$pos = strpos($url, $prefix);
	if ($pos !== false) {
		$uri = substr($url, $pos + strlen($prefix));
	}
	
	$dispatcher = new Phroute\Phroute\Dispatcher($provider->provideData(), new HandlerResolver($log, $conf));
	$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $uri);
	echo $response;
}
catch(Phroute\Phroute\Exception\HttpRouteNotFoundException $e) {
	http_response_code(404);
}
catch(Phroute\Phroute\Exception\HttpMethodNotAllowedException $e) {
	http_response_code(405);
	header($e->getMessage());
}
catch(Exception $e) {
	echo $e;
	http_response_code(500);
}
?>
