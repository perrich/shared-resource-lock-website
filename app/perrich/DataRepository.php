<?php 
namespace Perrich;

/**
 * Data repository
 */
class DataRepository
{
	/**
	 * File handle
	 *
	 * @var handle
	 */
	private $handle;
	
	/**
	 * Resources array
	 *
	 * @var array
	 */
	private $resources;
	
	public function __construct($handle) {
		$this->handle = $handle;
	}	

	/**
	 * Get all resources
	 *
	 * @return array
	 */
    public function getResources()
    {
        return $this->resources;
    }

	/**
	 * Get a resource
	 *
	 * @param $id The resource identifier
	 * @return Resource
	 */
	public function getResource($id) {
		foreach ($this->resources as $r){
			if ($r->id == $id) {
				return $r;
			}
		}

		return null;
	}
	
	/**
	 * Update a resource
	 *
	 * @param $resource The resource to update
	 * @return boolean
	 */
	public function updateResource($resource) {
		foreach ($this->resources as $r){
			if ($r->id == $resource->id) {
				$r->user = $resource->user;
				$r->date = $resource->date;
				$r->comment = $resource->comment;
				return true;
			}
		}

		return false;
	}

	/**
	 * Load resources
	 *
     * @throws RepositoryException if the file is empty or corrupted.
	 */
	public function load() {
		$str = stream_get_contents($this->handle);
		
		if ($str === null) {
			throw RepositoryException::create('Empty data.');
		}

		$this->resources = array();
		$objs = json_decode($str, false, 512);

		if ($objs === null) {
			throw RepositoryException::create('Unable to understand JSON.');
		}
		
		foreach ($objs as $o) {
			$resource = new Resource();
			$resource->init($o);
			$this->resources[] = $resource;
		}
	}
	
	/**
	 * Load resources
	 *
     * @throws RepositoryException If the file could not be saved.
	 */
	public function save() {
		rewind($this->handle);
		$str = json_encode($this->resources);
		
		if ($str === false) {
			throw RepositoryException::create('Unable to encode JSON.');
		}

		$result = fwrite($this->handle, $str);
		if ($result === false) {
			throw RepositoryException::create('Unable to save data.');
		}

		$result = fflush($this->handle);
		if ($result === false) {
			throw RepositoryException::create('Unable to save data.');
		}

		$result = ftruncate($this->handle, ftell($this->handle));
		
		if ($result === false) {
			throw RepositoryException::create('Unable to save data.');
		}
	}	
}