<?php 
namespace Perrich\Controllers;

use Perrich\DataRepository;
use Perrich\FileLocker;
use Perrich\HttpHelper;

class ResourceController extends Controller
{
	public function getResources()
	{
		$locker = ResourceController::getLocker(false);
		if ($locker === null) {
			http_response_code(409);
			return 'Locked repository, please retry later"}';
		}

		$repository = new DataRepository($locker->getHandle());
		$repository->load();
		$locker->unlock();
		return HttpHelper::jsonContent($repository->getResources());
	}
	
	public function updateResource($id)
    {
		$parameters = HttpHelper::getParameters();

		if (!isset($parameters['type'])) {
			return ResourceController::defineErrorMessage('Unsupported request');
		}

		$locker = ResourceController::getLocker(true);
		if ($locker === null) {
			return ResourceController::defineErrorMessage('Locked repository, please retry later"}');
		}

		$repository = new DataRepository($locker->getHandle());
		$repository->load();

		$resource = $repository->getResource($id);
		if ($resource === null) {
			$locker->unlock();
			return ResourceController::defineErrorMessage('Unknown resource"}');
		}

		if ($resource->user !== null && isset($parameters['user'])) {
			$locker->unlock();
			return ResourceController::defineErrorMessage('Resource is already hold');
		}
		
		if ($resource->user === null && !isset($parameters['user'])) {
			$locker->unlock();
			return ResourceController::defineErrorMessage('Resource is not hold');
		}

		$resource->user = $parameters['user'] === null ? null : $parameters['user'];
		$resource->date = $parameters['user'] === null ? null : \DateTime::createFromFormat(\DateTime::ISO8601, substr($parameters['date'], 0, 19) . '+0000');
		$resource->comment = $parameters['comment'] === null ? null : $parameters['comment'];
		$repository->updateResource($resource);

		$repository->save();
		$locker->unlock();

		if ($resource->user !== null) {
			$this->log->addInfo('User "' . $resource->user . '" has hold resource #' . $id, ResourceController::fillLogDetails());
		} else {
			$this->log->addInfo('Resource #' . $id . ' has been freed', ResourceController::fillLogDetails());
		}

		return HttpHelper::jsonContent('{"state": "OK"}');
	}
	
	private static function getLocker($needWrite)
	{
		$locker = new FileLocker(__DIR__ .'/../../db.json');
	
		if (!$locker->isLocked()) {
			if ($needWrite === false || $locker->lock()) {
				return $locker;
			}
		}

		return null;
   }
	
	private static function defineErrorMessage($message)
	{
	    return HttpHelper::jsonContent('{"state": "ERROR", "message": "' . $message . '"}');
    }

	private static function fillLogDetails()
	{
	   $array = array();
	   
	   if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
	      $array['maybe_real_ip'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
	   }
	   $array['ip'] = $_SERVER['REMOTE_ADDR'];

	   return $array;
    }	
}