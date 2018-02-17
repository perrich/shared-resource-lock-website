<?php
namespace App\Service;

use App\FileLocker;
use App\Entity\Resource;
use App\Exception\CheckException;
use App\Repository\DataRepository;
use App\Repository\GlobalLockerRepository;
use App\Repository\LockerRepository;
use Psr\Log\LoggerInterface;

class ResourceService
{
	private $logger;
	private $dataPath;

	public function __construct(LoggerInterface $logger, string $dataPath) {
		$this->logger = $logger;

		$this->dataPath = ResourceService::checkPath($dataPath);
	}
	
	public function LoadRepositoryOnly() : ?DataRepository
	{
        $lockerRepository = new LockerRepository();
		$locker = $lockerRepository->getLocker($this->getDataPath(), false);
		$repository = null;

		if ($locker === null) {
			$this->logger->error('Locked repository, please retry later');
			return null;
		}
		
		try
		{
			$repository = new DataRepository($locker->getHandle());
			$repository->load();
		}
		catch(RepositoryException $re)
		{
            $this->logger->error('Resource cannot be read: ' . $re->getMessage());
		}
        $locker->unlock();

		return $repository;
	}

	public function saveResource(FileLocker $locker, int $id, Resource $request) : Resource
	{
		$repository = new DataRepository($locker->getHandle());
		$repository->load();

		$resource = $repository->getResource($id);
		if ($resource === null) {
			throw CheckException::create('Unknown resource');
		}

		if ($resource->user !== null && $request->user !== null) {
			throw CheckException::create('Resource is already hold');
		}
		
		if ($resource->user === null && $request->user === null) {
			throw CheckException::create('Resource is not hold');
		}

		$resource->user = $request->user;
		$resource->date = $request->date;
		$resource->comment = $request->comment;
		$repository->updateResource($resource);

		$repository->save();

		return $resource;
	}
	
	public function getGlobalRepository() : GlobalLockerRepository
	{		
		$path =  $this->dataPath . '/resource_db.lock';
		return new GlobalLockerRepository($path);
	}
	
	public function getLocker() : FileLocker
	{
		$lockerRepository = new LockerRepository();
		return $lockerRepository->getLocker($this->getDataPath(), true);
	}
	
	private function getDataPath() : string
	{
		return $this->dataPath . '/resource_db.json';
	}

	private static function checkPath(string $dataPath) : string
	{
		return (strlen($dataPath) > 0 && substr($dataPath, -1) !== '/')  ? $dataPath . '/' : $dataPath;
	}
}