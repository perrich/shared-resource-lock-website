<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;

class MainController
{
    public function index() : Response
    {
        $path = '../public/index.html';

        if (file_exists($path)) {
            return new Response(file_get_contents($path));
        }

        return new Response('bienvenue !');
	}
}