<?php
namespace App\Exception;
/**
 * Used for errors when using the data repository.
 */
class RepositoryException extends \Exception
{
    public function __construct($message) {
        parent::__construct($message, 0, null);
    }

    public static function create($format, ...$args) {
        return new RepositoryException(vsprintf($format, $args));
    }
}