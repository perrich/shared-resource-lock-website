<?php 
namespace App\Repository;

use App\FileLocker;

/**
 * Locker repository
 */
class LockerRepository
{
	/**
	* Try to get a Locker from the provided path
	*/
	public function getLocker($path, $needWrite) : ?FileLocker
	{
		$locker = new FileLocker($path);
	
		try {
			if (!$locker->isLocked() && ($needWrite === false || $locker->lock())) {
				return $locker;
			}
		}
		catch(\Exception $ex) {}

		return null;
	}
}