<?php 
namespace Perrich;

/**
 * Utilities class
 */
class Utilities
{
	/**
	* Try to get a Locker from the provided path
	*/
	public static function getLocker($path, $needWrite)
	{
		$locker = new FileLocker($path);
	
		if (!$locker->isLocked()) {
			if ($needWrite === false || $locker->lock()) {
				return $locker;
			}
		}

		return null;
	}
}