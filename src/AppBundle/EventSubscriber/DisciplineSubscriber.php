<?php
/**
 * Created by PhpStorm.
 * User: antoine
 * Date: 07/02/17
 * Time: 16:21
 */

namespace AppBundle\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use AppBundle\Entity\Discipline;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;

final class DisciplineSubscriber implements EventSubscriberInterface
{

    /**
     * @var KernelInterface the symfony kernel
     * Used to get Root directory.
     */
    private $container;

    /**
     * @param KernelInterface $kernel
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }


    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                ['createDiscipline', EventPriorities::POST_WRITE],
            ]
        ];
    }


    /**Create a folder with the id of the discipline in var/git if it doesn't exist yet.
     * That folder can later be used to store Discipline associated repo.
     * @param GetResponseForControllerResultEvent $event
     */
    public function createDiscipline(GetResponseForControllerResultEvent $event)
    {
        $discipline = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$discipline instanceof Discipline || Request::METHOD_POST !== $method) {
            return;
        }

        /** Create an associated folder in /var/git/id_discipline
         * Duplicated in DisciplineAdmin
         */
        $rootDir = $this->container->get('kernel')->getRootDir();
        $fs = new Filesystem();
        $path = $rootDir . '/../var/git/' . $discipline->getId();
        if(!is_dir($path)) {
            $fs->mkdir($path,0775);
            $git_client = $this->container->get('app.git.client');
            $git_client->create($path,$discipline->getGitUrl());
        }
    }

    public function deleteDiscipline(GetResponseForControllerResultEvent $event)
    {
        $discipline = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$discipline instanceof Discipline || Request::METHOD_DELETE !== $method) {
            return;
        }

        /** Remove the associated folder in /var/git/id_discipline
         * Duplicated in DisciplineAdmin
         */
        $rootDir = $this->container->get('kernel')->getRootDir();
        $fs = new Filesystem();
        if(is_dir($rootDir.'/../var/git/'.$discipline->getId())) {
            $fs->remove($rootDir . '/../var/git/' . $discipline->getId());
        }
    }

}