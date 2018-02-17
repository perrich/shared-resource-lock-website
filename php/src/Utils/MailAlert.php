<?php 
namespace App\Utils;

use \DateTime;
use \DateInterval;
use Twig\Environment;
use App\Entity\Resource;
use App\Exception;
use App\Repository\DataRepository;

/**
 * Mail alert builder
 */
class MailAlert
{
	private $twig;

	public function __construct(Environment $twig) {
		$this->twig = $twig;
	}
	public function prepareResourceCheckMessage(DataRepository $repository, array $config) : array
	{
		$issues = array();
		try
		{

			$minAllowedDate = new DateTime('NOW');
			$interval = new DateInterval('PT' .  $config['resourceCheckMessage']['maxHoldingDelayInHours'] . 'H');
			$interval->invert = 1;
			$minAllowedDate->add($interval);

			foreach ($repository->getResources() as $r){
				if ($r->date !== null && $r->date < $minAllowedDate) {
					$issues[] = $r;
				}
			}
		}
		catch(RepositoryException $re)
		{
			$this->log->error('Message cannot be built: ' . $re->getMessage());
		}

		return $issues;
	}

	public function send(\Swift_Mailer $mailer, array $config, array $issues) : bool
	{
		$message = (new \Swift_Message())
		->setSubject($config['subject'])
		->setTo($config['to'])
		->setFrom($config['from'])
		->setBody($this->twig->render('emails/resource_check.html.twig', array('issues' => $issues)), 'text/html');

		return $mailer->send($message) !== 0;
	}
}