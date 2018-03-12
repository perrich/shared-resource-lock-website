<?php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Command\LockableTrait;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Yaml\Yaml;

use App\Utils\MailAlert;
use App\Repository\DataRepository;
use App\Service\ResourceService;

class MailAlertCommand extends Command
{
    use LockableTrait;

    private $service;
    private $alert;
    private $mailer;

	public function __construct(ResourceService $service, \Swift_Mailer $mailer, MailAlert $alert) {
		$this->mailer = $mailer;
        $this->service = $service;
        $this->alert = $alert;
        
        parent::__construct();
    }
    
    protected function configure()
    {
        $this->setName('app:mail-alert');
        $this->setDescription('Check if alert for too long lock should be sent to users.');
        $this->setHelp('This command allows you to alert users about too long locked resources...');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        if (!$this->lock()) {
            $output->writeln('The command is already running in another process.');

            return 0;
        }

        $output->writeln('Checking too long locked resources...');

        $repository = $this->service->LoadRepositoryOnly();

		if ($repository === null) {
            $output->writeln('Error: Repository not found');
            return 0;
        }
        
        if ($this->check($repository, $output)) {
            $output->writeln('At least one resource found and user have been notified.'); 
        }
    }

    private function check(DataRepository $repository, OutputInterface $output) 
    {
		$config = Yaml::parse(
			file_get_contents(__DIR__.'/../../config/mailalert.yaml')
		);

		$issues = $this->alert->prepareResourceCheckMessage($repository, $config);
		
		if (count($issues) === 0) {
            $output->writeln('Nothing to send, everything is ok.');
            return false;
		}

		if (!$this->alert->send($this->mailer, $config['resourceCheckMessage'], $issues)) {
            $output->writeln('Error: Email cannot be sent');
            return false;
        }
        
        return true;
    }
}