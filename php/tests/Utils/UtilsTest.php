<?php
namespace App\Tests\Utils;

use App\Utils\Utils;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ServerBag;

class UtilsTest extends TestCase
{	
	public function testdefineErrorMessage()
	{
		$message = 'test d\'un message';
		$response = Utils::defineErrorMessage($message);
		$this->assertInstanceOf(JsonResponse::class, $response);
		$this->assertSame('{"state": "ERROR", "message": "' . $message . '"}', $response->getContent());
	}
	
	public function testfillLogDetails()
	{
		$ip = '127.0.0.1';
		$maybe_real_ip = '198.168.0.1';

		$server = new ServerBag();
		$server->set('REMOTE_ADDR', $ip);

		$result = Utils::fillLogDetails($server);
		$this->assertCount(1, $result);
		$this->assertArrayHasKey('ip', $result);
		$this->assertSame($ip, $result['ip']);
		
		$server->set('HTTP_X_FORWARDED_FOR', $maybe_real_ip);

		$result = Utils::fillLogDetails($server);
		$this->assertCount(2, $result);
		$this->assertArrayHasKey('ip', $result);
		$this->assertArrayHasKey('maybe_real_ip', $result);
		$this->assertSame($ip, $result['ip']);
		$this->assertSame($maybe_real_ip, $result['maybe_real_ip']);
    }

	public static function fillLogDetails(ServerBag $server)
	{
	   $array = array();
	   
	   if ($server->get('HTTP_X_FORWARDED_FOR') !== null) {
	      $array['maybe_real_ip'] = $server->get('HTTP_X_FORWARDED_FOR');
	   }
	   $array['ip'] = $server->get('REMOTE_ADDR');

	   return $array;
    }   
}