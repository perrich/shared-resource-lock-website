<?php 
namespace Perrich;

use Phroute\Phroute\RouteCollector;

class RouteDataProvider
{
	const CACHE_FILENAME = 'route.cache';
	
	private $cachePath;
	
	public function __construct($path = null)
	{
		$this->cachePath = (isset($path) ? $path : __DIR__ ). '/../'. static::CACHE_FILENAME;
	}
	
	private function addRoutes($routeCollector)
	{
		$routeCollector->get('/mail/', ['\\Perrich\\Controllers\\MailController','createMail']);
		$routeCollector->get('/resources/', ['\\Perrich\\Controllers\\ResourceController','getResources']);
		$routeCollector->put('/resources/{id}', ['\\Perrich\\Controllers\\ResourceController','updateResource']);
	}
	
	/**
	 * Provide the routes.
	 *
	 * @return Phroute\Phroute\RouteDataInterface
	 */	
	public function provideData()
	{
		if (file_exists($this->cachePath)) {
			$dispatchData = unserialize(file_get_contents($this->cachePath));
		} else {
			$routeCollector = new RouteCollector();
			$this->addRoutes($routeCollector);
			$dispatchData = $routeCollector->getData();
			file_put_contents($this->cachePath, serialize($dispatchData));
		}
		
		return $dispatchData;
	}
}