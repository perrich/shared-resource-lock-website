<?php 
namespace App\Utils;

use \DateTime;
use \DateInterval;
use App\Exception;
use App\Repository\DataRepository;

/**
 * Mail alert builder
 */
class MailAlert
{
	public function prepareResourceCheckMessage(DataRepository $repository, array $config) : string
	{
		$message = '';
		try
		{

			$minAllowedDate = new DateTime('NOW');
			$interval = new DateInterval('PT' .  $config['resourceCheckMessage']['maxHoldingDelayInHours'] . 'H');
			$interval->invert = 1;
			$minAllowedDate->add($interval);

			foreach ($repository->getResources() as $r){
				if ($r->date !== null && $r->date < $minAllowedDate) {
					if ($message === '')
					{
						$message = MailAlert::getHtmlHeader();
					}
					
					$message .= MailAlert::getHtmlElement($r);
				}
			}

			if ($message !== '')
			{
				$message .= MailAlert::getHtmlFooter();
			}
		}
		catch(RepositoryException $re)
		{
			$this->log->error('Message cannot be built: ' . $re->getMessage());
		}

		return $message;
	}

	public function send(\Swift_Mailer $mailer, array $config, string $body)
	{
		$message = (new \Swift_Message())
		->setSubject($config['subject'])
		->setTo($config['to'])
		->setFrom($config['from'])
		->setBody($body, 'text/html');

		if (!$mailer->send($message)) {
			return new Response('Email cannot be sent');
		}
	}

	private static function getHtmlHeader()
	{
		return '
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
		</head>
		<body>
		<b>List of all old locks, please check them:</b>
		<ul>
		';
	}
	
	private static function getHtmlElement($r)
	{
		$line = '<li>';
		$line .= $r->type;
		if ($r->subtype !== null)
		{
			$line .= ' - ' . $r->subtype;
		}
		$line .= ' - ' . $r->name;
		$line .= ' (user: ' . $r->user .')';
		$line .= '</li>';

		return $line;
	}

	private static function getHtmlFooter()
	{
		return '
		</ul>
		</body>
		</html>
		';
	}
}