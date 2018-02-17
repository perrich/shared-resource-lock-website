<?php
namespace App\Utils;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ServerBag;

class Utils
{	
	public static function defineErrorMessage(string $message) : JsonResponse
	{
	    return JsonResponse::fromJsonString('{"state": "ERROR", "message": "' . $message . '"}');
	}
		
	public static function defineOkMessage() : JsonResponse
	{
	    return JsonResponse::fromJsonString('{"state": "OK"}');
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
	
	public static function var_dump_ret($mixed = null) {
		ob_start();
		var_dump($mixed);
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	  }
}