<?php 
namespace Perrich;

/**
 * HTTP management helpers
 */
class HttpHelper
{
	/**
	 * Disable the HTTP cache
	 */
	public static function disableCache()
	{
		header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		header("Expires: Sun, 01 Jan 2014 00:00:00 GMT");
	}

	/**
	 * Content is JSON
	 *
	 * @param $json result string or object to convert to json
	 */
	public static function jsonContent($json = null)
	{
		header("Content-Type: application/json");
		
		echo is_string($json) ? $json : json_encode($json);
	}
	
	/**
	 * Use the HTTP Cache.
     *  If nothing has changed since previous call, exit the script with 304 result.
	 *
	 * @param $timestamp The timestamp of the last change (might be filemtime(__FILE__));
	 * @param $etag_prefix something to distinguish two etag (only if necessary)
	 */
	public static function enableCache($timestamp, $etag_prefix = null)
	{
		$tsstring = gmdate("D, d M Y H:i:s", $timestamp) . " GMT";
		$etag = "\"".sha1(($etag_prefix !== null ? $etag_prefix : ""). $timestamp)."\"";

		$if_modified_since = isset($_SERVER["HTTP_IF_MODIFIED_SINCE"]) ? $_SERVER["HTTP_IF_MODIFIED_SINCE"] : false;
		$if_none_match = isset($_SERVER["HTTP_IF_NONE_MATCH"]) ? $_SERVER["HTTP_IF_NONE_MATCH"] : false;
		
		if ((($if_none_match && $if_none_match == $etag) || (!$if_none_match)) &&
			($if_modified_since && $if_modified_since == $tsstring))
		{
			http_response_code(304);
			exit();
		}
		else
		{
			header("Cache-Control: public");
			header("Last-Modified: ".$tsstring);
			header("ETag: ".$etag);
		}		
	}
	
	/**
	 * Gets the provided HTTP parameters.
	 * support POST raw JSON content (angularjs way)
	 *
	 * @return array
	 */
	public static function getParameters()
	{
		if ($_SERVER["REQUEST_METHOD"] == "POST") 
		{
			if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) 
			{
				return json_decode(trim(file_get_contents("php://input")), true);
			}
			
			return $_POST;
		}
		else if ($_SERVER["REQUEST_METHOD"] == "PUT") 
		{
			if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) 
			{
				return json_decode(trim(file_get_contents("php://input")), true);
			}
			
			return $_PUT;
		}
		else if ($_SERVER["REQUEST_METHOD"] == "GET") 
		{
			return $_GET;
		}
		
		return array();
	}
}