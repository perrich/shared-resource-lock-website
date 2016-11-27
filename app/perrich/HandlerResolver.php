<?php 
namespace Perrich;

/**
 * Resolve an handler by creating.the corresponding object and call the init method on it.
 */
class HandlerResolver implements \Phroute\Phroute\HandlerResolverInterface
{
	private $log;
	private $config;
	
	public function __construct($log, $config)
	{
		$this->log = $log;
		$this->config = $config;
	}
	
	/**
	 * Create an instance of the given handler.
	 *
	 * @param $handler
	 * @return array
	 */	
	public function resolve($handler)
	{
		if(is_array($handler) && is_string($handler[0]))
		{
			$handler[0] = new $handler[0];
			$handler[0]->init($this->log, $this->config);
		}
		
		return $handler;
	}
}