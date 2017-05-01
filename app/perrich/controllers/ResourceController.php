<?php 
namespace Perrich\Controllers;

use Perrich\DataRepository;
use Perrich\RepositoryException;
use Perrich\FileLocker;
use Perrich\HttpHelper;
use Perrich\Utilities;

class ResourceController extends Controller
{
	public function getResources()
	{
		$locker = Utilities::getLocker($this->getDataPath(), false);
		if ($locker === null) {
			http_response_code(409);
			return 'Locked repository, please retry later';
		}
		
		try
		{
			$repository = new DataRepository($locker->getHandle());
			$repository->load();
		}
		catch(RepositoryException $re)
		{
			$this->log->error('Resource cannot be read: ' . $re->getMessage());
			http_response_code(404);
			return 'Repository not found';
		}
		$locker->unlock();
		return HttpHelper::jsonContent($repository->getResources());
	}
	
	public function updateResource($id)
    {
		$parameters = HttpHelper::getParameters();

		if (!isset($parameters['type'])) {
			return ResourceController::defineErrorMessage('Unsupported request');
		}

		$locker = Utilities::getLocker($this->getDataPath(), true);
		if ($locker === null) {
			return ResourceController::defineErrorMessage('Locked repository, please retry later');
		}

		try
		{
			$resource = $this->saveResource($locker, $id, $parameters);
			$locker->unlock();

			if ($resource->user !== null) {
				$this->log->addInfo('User "' . $resource->user . '" has hold resource #' . $id, ResourceController::fillLogDetails());
			} else {
				$this->log->addInfo('Resource #' . $id . ' has been freed', ResourceController::fillLogDetails());
			}
		}
		catch(RepositoryException $re)
		{
			$this->log->error('Resource cannot be saved: ' . $re->getMessage());
			
			$locker->unlock();
			return ResourceController::defineErrorMessage('Repository cannot save resource');
		}

		return HttpHelper::jsonContent('{"state": "OK"}');
	}

	private function saveResource($locker, $id, $parameters)
	{
		$repository = new DataRepository($locker->getHandle());
		$repository->load();

		$resource = $repository->getResource($id);
		if ($resource === null) {
			$locker->unlock();
			return ResourceController::defineErrorMessage('Unknown resource');
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

		return $resource;
	}

	private function getDataPath()
	{
		return __DIR__ .'/../../' . $this->config->get('databasefileRelativePath');
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