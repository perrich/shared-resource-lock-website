<?php 
namespace Perrich;

/**
 * File lock management
 */
class FileLocker
{
	/**
	 * Filename
	 *
	 * @var string
	 */
	private $filename;
	
	/**
	 * File handle
	 *
	 * @var handle
	 */
	private $handle;

	
	public function __construct($filename) {
		$this->filename = $filename;
		$this->handle = fopen($filename, "r+");
	}	

	/**
	 * Is current file locked?
	 *
	 * @return boolean
     * @throws FileException If the file could not be checked.
	 */
	public function isLocked() {
		if (!$this->handle) {
			throw FileException::create(
                'Unable to open "%s" for checking.',
                $this->filename
            );
		}
		 
		return !flock($this->handle, LOCK_SH);
	}

	/**
	 * Get the file handle
	 *
	 * @return handle
	 */
	public function getHandle() {
		return $this->handle;
	}
	
	/**
	 * Try to lock the file
	 *
	 * @return boolean
     * @throws FileException If the file could not be locked.
	 */
	public function lock() {
		if (!$this->handle) {
			throw FileException::create(
                'Unable to open "%s" for locking.',
                $this->filename
            );
		}

		return flock($this->handle, LOCK_EX);
	}
 
	/**
	 * Try to unlock the file
	 *
	 * @return boolean
     * @throws FileException If the file could not be unlocked.
	 */
	public function unlock() {
		if (!$this->handle) {
			throw FileException::create(
                'Unable to open "%s" for unlocking.',
                $this->filename
            );
		}
		 
		return flock($this->handle, LOCK_UN);
	}	
}