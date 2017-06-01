<?php 
namespace Perrich\Controllers;

use Perrich\DataRepository;
use Perrich\RepositoryException;
use Perrich\FileLocker;
use Perrich\HttpHelper;
use Perrich\Utilities;
use \DateTime;
use \DateInterval;

class MailController extends Controller
{
	public function createMail()
	{
		$message = $this->prepareMessage();
		
		if (!isset($message)) {
			return 'Email cannot be sent';
		}

		if ($message === '') {
			return 'Nothing to send';
		}

		if (!$this->sendEmail($message)) {
			return 'Email cannot be sent';
		}

		return 'OK';
	}

	private function prepareMessage()
	{
		$locker = Utilities::getLocker(__DIR__ .'/../../' . $this->config->get('databasefileRelativePath'), true);
		if ($locker === null) {
			$this->log->error('Locked repository, please retry late');
			return null;
		}

		$message = null;
		try
		{
			$minAllowedDate = new DateTime('NOW');
			$interval = new DateInterval('PT' .  $this->config->get('warning_mail.maxHoldingDelayInHours') . 'H');
			$interval->invert = 1;
			$minAllowedDate->add($interval);

			$repository = new DataRepository($locker->getHandle());
			$repository->load();

			$message = '';

			foreach ($repository->getResources() as $r){
				if ($r->date !== null && $r->date < $minAllowedDate) {
					if ($message === '')
					{
						$message = MailController::getHtmlHeader();
					}
					
					$message .= MailController::getHtmlElement($r);
				}
			}

			if ($message !== '')
			{
				$message .= MailController::getHtmlFooter();
			}
		}
		catch(RepositoryException $re)
		{
			$this->log->error('Message cannot be built: ' . $re->getMessage());
		}

		$locker->unlock();

		return $message;
	}

	private function sendEmail($message) 
	{
		$mail = new \PHPMailer();

		$mail->isSMTP();
		$mail->Host = $this->config->get('smtp.host');
		$mail->Port = $this->config->get('smtp.port'); 
		
		if (strlen($this->config->get('smtp.login')) > 0) {
			$mail->SMTPAuth = true;
			$mail->Username = $this->config->get('smtp.login');
			$mail->Password = $this->config->get('smtp.password');
		}

		$security = $this->config->get('smtp.security');
		if (isset($security) && $security != '') {
			$mail->SMTPSecure = $security;
		}

		$mail->setFrom($this->config->get('warning_mail.from'));
		$mail->addAddress($this->config->get('warning_mail.to'));
		$mail->isHTML(true);
		$mail->CharSet = 'UTF-8';
		$mail->Subject = $this->config->get('warning_mail.subject');
		$mail->Body = $message;

		if (!$mail->send()) {
			$this->log->error('Message cannot be sent: ' . $mail->ErrorInfo);
			return false;
		}

		return true;
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