<?php

namespace App\EventListener;

use App\Exception\ProcessingException;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionListener implements EventSubscriberInterface
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        
        if ($exception instanceof ProcessingException)
        {
            if ($exception->getType() === ProcessingException::JSON) {
                $response = JsonResponse::fromJsonString('{"state": "ERROR", "message": "' . $exception->getMessage() . '"}');
            } else if ($exception->getType() === ProcessingException::TEXT) {
                $response = new Response($exception->getMessage(), Response::HTTP_NOT_FOUND, array('content-type' => 'text/plain'));
            } else {
                $response = new Response($exception->getMessage());
            }            

            $event->setResponse($response);
            $event->stopPropagation();
        }
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::EXCEPTION => 'onKernelException',
        );
    }
}