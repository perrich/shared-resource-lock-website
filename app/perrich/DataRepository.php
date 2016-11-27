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
     * @throws FileException If the file could not be checked.
	 */
	public function updateResource($resource) {
		foreach ($this->resources as $r){
			if ($r->type == $resource->type && $r->name == $resource->name) {
				$r->user = $resource->user;
				$r->date = $resource->date;
				return true;
			}
		}

		return false;
	}

	/**
	 * Load resources
	 *
	 * @return boolean
     * @throws FileException If the file could not be checked.
	 */
	public function load() {
		$str = stream_get_contents($this->handle);
		$this->resources = array();
		$objs = json_decode($str, false, 512);
		
		foreach ($objs as $o) {
			$resource = new Resource();
			$resource->init($o);
			$this->resources[] = $resource;
		}
	}
	
	/**
	 * Load resources
	 *
	 * @return boolean
     * @throws FileException If the file could not be checked.
	 */
	public function save() {
		rewind($this->handle);
		$str = json_encode($this->resources);
		$result = fwrite($this->handle, $str) !== false;
		
		fflush($this->handle);
		ftruncate($this->handle, ftell($this->handle));
		
		return $result;
	}	
}