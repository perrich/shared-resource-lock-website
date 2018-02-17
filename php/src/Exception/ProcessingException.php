<?php
namespace App\Exception;

/**
 * Used for errors during a route processing using the provided response type.
 */
class ProcessingException extends \Exception
{
    const JSON = 1;
    const TEXT = 2;
    const HTML = 3;

    /**
     * @var int
     */
    protected $type;

    public function __construct(int $type, string $message) {
        parent::__construct($message, 0, null);
        $this->type = $type;
    }

    public static function create(int $type, string $format, ...$args) {
        return new ProcessingException($type, vsprintf($format, $args));
    }

    public function getType() : int
    {
        return $this->type;
    }
}