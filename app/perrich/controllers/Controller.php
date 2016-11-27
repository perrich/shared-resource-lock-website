<?php 
namespace Perrich\Controllers;

abstract class Controller
{
	protected $log;
	protected $config;
	
	public function init($log, $config)
	{
		$this->log = $log;
		$this->config = $config;
	}
}