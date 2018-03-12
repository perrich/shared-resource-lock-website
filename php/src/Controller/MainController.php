<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends Controller
{
    /**
     * @Route("/")
     */
    public function index() : Response
    {
        $path = '../public/index.html';

        if (file_exists($path)) {
            return new Response(file_get_contents($path));
        }

        return new Response('bienvenue !');
	}
}