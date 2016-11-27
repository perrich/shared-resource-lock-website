<?php
// composer autoload
require_once  __DIR__ . '/../vendor/autoload.php';

// ------------------------------------------------------
// Our Autoloader

class PerrichLoader {
    const PREFIX = 'Perrich\\';
    private static $base_dir = '';
    private static $length = 0;
    
    public static function classLoader($class)
    {
        if (static::$length == 0) {
            static::$base_dir = __DIR__ . '/perrich/';
            static::$length = strlen(static::PREFIX);
        }
        if (strncmp(static::PREFIX, $class, static::$length) !== 0) {
            // no, move to the next registered autoloader
            return;
        }
        $relative_class = substr($class, static::$length);
        $relative_class = str_replace('\\', '/', $relative_class);
        
        $pos = strrpos($relative_class, '/');      
        if ($pos !== false) {
            $file = static::$base_dir . strtolower(substr($relative_class, 0, $pos)) . substr($relative_class, $pos) . '.php';
        }
        else
        {
            $file = static::$base_dir . $relative_class . '.php';
        }
        if (file_exists($file)) {
            require $file;
        }
    }
}

spl_autoload_register(array('PerrichLoader', 'classLoader'));

// ------------------------------------------------------
// Load configuration

use Noodlehaus\Config;

$conf = Config::load(__DIR__ . '/config.json');

// update logfile to use current directory
$conf->set('logfile', __DIR__ . '/'.$conf->get('logfile'));
?>