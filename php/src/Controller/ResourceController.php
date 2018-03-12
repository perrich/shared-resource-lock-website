<?php
namespace App\Controller;

use App\Entity\Resource;
use App\Exception\CheckException;
use App\Exception\ProcessingException;
use App\Repository\DataRepository;
use App\Repository\LockerRepository;
use App\Repository\GlobalLockerRepository;
use App\Utils\MailAlert;
use App\Utils\Utils;
use App\Service\ResourceService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

class ResourceController extends Controller
{
	private $logger;
	private $mailer;
	private $session;
	private $service;

	public function __construct(LoggerInterface $logger, SessionInterface $session, \Swift_Mailer $mailer, ResourceService $service) {
		$this->logger = $logger;
		$this->mailer = $mailer;
		$this->session = $session;
		$this->service = $service;

		$this->session->start();
	}

    /**
     * @Route("/api/", 
	 *     name="Get all ressources"
	 * )
     */
    public function list() : Response
    {
		$repository = $this->service->LoadRepositoryOnly();

		if ($repository === null) {
			throw new ProcessingException(ProcessingException::TEXT, 'Repository not found');
		}

		return new JsonResponse($repository->getResources());
	}

    /**
     * @Route("/api/{id}", 
	 *     name="Update a ressource lock", 
	 *     requirements={"id"="\d+"}, 
	 *     methods={"PUT"}
	 * )
     */
    public function update(int $id, Request $request) : Response
    {
		$data = json_decode($request->getContent());

		if ($data->type === null) {
			throw new ProcessingException(ProcessingException::JSON, 'Unsupported request');
		}

		$this->getUnlockedGlobalRepository();
		$locker = $this->service->getLocker();
		if ($locker === null) {
			throw new ProcessingException(ProcessingException::JSON, 'Locked repository, please retry updating later');
		}

		try
		{
			$this->service->saveResource($locker, $id, $this->JsonObjToResource($data));

			if ($data->user !== null) {
				$this->logger->addInfo('User "' . $data->user . '" has hold resource #' . $id, Utils::fillLogDetails($request->server));
			} else {
				$this->logger->addInfo('Resource #' . $id . ' has been freed', Utils::fillLogDetails($request->server));
			}
		}
		catch(CheckException $re)
		{
			$this->logger->error('Resource cannot be saved due to an invalid check: ' . $re->getMessage());
			throw new ProcessingException(ProcessingException::JSON, $re->getMessage());
		}
		catch(RepositoryException $re)
		{
			$this->logger->error('Resource cannot be saved: ' . $re->getMessage());
			throw new ProcessingException(ProcessingException::JSON, 'Repository cannot save resource');
		}
		finally
		{
			$locker->unlock();
		}

		return Utils::defineOkMessage();
    }
    
    /**
     * @Route("/api/check/", 
	 *     name="Check for too old lock"
	 * )
     */
    public function check(MailAlert $alert) : Response
    {
		$repository = $this->service->LoadRepositoryOnly();

		if ($repository === null) {
			throw new ProcessingException(ProcessingException::TEXT, 'Repository not found');
		}

		$config = Yaml::parse(
			file_get_contents(__DIR__.'/../../config/mailalert.yaml')
		);

		$issues = $alert->prepareResourceCheckMessage($repository, $config);
		
		if (count($issues) === 0) {
			throw new ProcessingException(ProcessingException::TEXT, 'Nothing to send, everything is ok.');
		}

		if (!$alert->send($this->mailer, $config['resourceCheckMessage'], $issues)) {
			throw new ProcessingException(ProcessingException::TEXT, 'Email cannot be sent');
		}

		return new Response('OK');
    }    
	
    /**
     * @Route("/api/lock/",
	 *     name="Lock the configuration"
	 * )
     */
    public function lock() : Response
    {
		$globalRepository = $this->service->getGlobalRepository();
		if (!$globalRepository->lock($this->session->getId())) {
			throw new ProcessingException(ProcessingException::JSON, 'Repository configuration cannot be locked.');
		}

		return Utils::defineOkMessage();
	}
		
    /**
     * @Route("/api/unlock/{force}", 
	 *     name="Unlock the configuration", 
	 *     requirements={"force"="force"},
     *     defaults={"force": null}
	 * )
     */
    public function unlock($force) : Response
    {
		$isForced = $force === 'force';

		$globalRepository = $this->service->getGlobalRepository();
		if (!$globalRepository->unlock($_COOKIE['PHPSESSID'], $isForced)) {
			if (!$isForced) {
				throw new ProcessingException(ProcessingException::JSON, 'Must be forced to unlock');
			}
			throw new ProcessingException('Repository configuration cannot be unlocked.');
		}

		return Utils::defineOkMessage();
    }

    /**
     * @Route("/api/configure/", 
	 *     name="Update the configuration (available ressources)", 
	 *     methods={"PUT"}
	 * )
     */
    public function configure(Request $request) : Response
    {
		$globalRepository = $this->service->getGlobalRepository();
		if (!$globalRepository->isLocked()) {
			$this->logger->error('Resource configuration cannot be saved due to an unlocked global repository');
			throw new ProcessingException(ProcessingException::JSON, 'Repository configuration cannot be saved.');
		}

		if (!$globalRepository->isAllowed($this->session->getId())) {
			$this->logger->error('Resource configuration cannot be saved due to an not allowed global repository ('.$this->session->getId().').');
			throw new ProcessingException(ProcessingException::JSON, 'Repository configuration cannot be saved.');
		}		

		$locker = $this->service->getLocker();
		if ($locker === null) {
			throw new ProcessingException(ProcessingException::JSON, 'Locked repository, please retry configuration later');
		}

		try
		{
			$data = json_decode($request->getContent());
			$repository = new DataRepository($locker->getHandle());
			$repository->updateAll($data);	
			$repository->save();
		}
		catch(CheckException $re)
		{
			$this->logger->error('Resource configuration cannot be saved due to an invalid check: ' . $re->getMessage());
			throw new ProcessingException(ProcessingException::JSON, $re->getMessage());
		}
		catch(RepositoryException $re)
		{
			$this->logger->error('Resource configuration cannot be saved: ' . $re->getMessage());
			throw new ProcessingException(ProcessingException::JSON, 'Repository configuration cannot be saved');
		}
		finally
		{
			$locker->unlock();
		}

		return Utils::defineOkMessage();
	}

	private function JsonObjToResource($obj) : Resource
	{
		$resource = new Resource();
		$resource->user = $obj->user;
		$resource->date = $obj->user === null ? null : \DateTime::createFromFormat(\DateTime::ISO8601, substr($obj->date, 0, 19) . '+0000');
		$resource->comment =  $obj->comment;

		return $resource;
	}

    private function getUnlockedGlobalRepository() : GlobalLockerRepository
    {
		$globalRepository = $this->service->getGlobalRepository();
		if ($globalRepository->isLocked()) {
			throw new ProcessingException(ProcessingException::JSON, 'Repository configuration under modification, please retry later');
		}

		return $globalRepository;
	}
}