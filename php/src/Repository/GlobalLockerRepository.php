<?php 
namespace App\Repository;

/**
 * Global Locker repository
 */
class GlobalLockerRepository
{
	/**
	 * Path
	 *
	 * @var string
	 */
	private $path;

	const LOCK_DELAY = 30 * 60; // 30 minutes

	
	public function __construct($path) {
		$this->path = $path;
	}

	public function isLocked() : bool
	{
		if (file_exists($this->path)) {
			$limit = filectime($this->path) + GlobalLockerRepository::LOCK_DELAY;
			if (time() <= $limit) {
				return true;
			}
			unlink($this->path);
		}

		return false;
	}

	public function lock($creator_sid) : bool
	{
		try {
			$handle = fopen($this->path, 'x');

			if (!$handle) {
				return false;
			}
			fwrite($handle, $creator_sid);
			fclose($handle);
		}
		catch(\Exception $ex) {
			return false;
		}
		return true;
	}

	public function unLock($creator_sid, $force = false) : bool
	{
		try {
			if ($force === false && !$this->isAllowed($creator_sid)) {
				return false;
			}

			unlink($this->path);
		}
		catch(\Exception $ex) {
			return false;
		}

		return true;
	}

	public function isAllowed($creator_sid) {
		return $creator_sid === file_get_contents($this->path);
	}
}