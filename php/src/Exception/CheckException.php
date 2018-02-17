<?php
namespace App\Exception;
/**
 * Used for errors when trying to check something.
 */
class CheckException extends \Exception
{
    public function __construct($reason) {
        parent::__construct($reason, 0, null);
    }

    public static function create($format, ...$args) {
        return new CheckException(vsprintf($format, $args));
    }
}