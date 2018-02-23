# shared-resource-lock-website

A website to manage shared resources locks using Symfony 4 and Angular 5.

Provide a way to manage limited resource access by creating an easy lock mechanism and a web dashboard.

## Details

* PHP part contains a REST webservice to manage the resource list. A single JSON file is used as persistance layer.
* Website is created using Angular 5. It provides a dashboard view and a resource details view.

## Prerequisites

* Node.JS
  * Angular-cli (build/develop client side)
* PHP 7.x (server side shared management)
  * Composer
  * Symfony 4

## How to test it?

You only need 4 steps :

1. Run "composer install" in the _php_ folder.
2. Run "npm install" in the _angular_ folder
3. Edit the _angular/assets/config.json_ to set the right URLs of the webservice
4. Run "php -S localhost:8000 -t public/" from _php_ folder
5. Run "ng serve --open" from _angular_ folder

## How to deploy?

1. call ng -build
2. copy the _php_ folder to the production folder
3. copy _angular/dist_ contents to the _public_ subfolder of the production folder
4. edit bellow files:
   * _public/assets/config.json_ to set the right URLs of the webservice
   * _config/mailalert.yaml_ to define alert mail
5. add _.env.dist_ contents as environment variable
6. _public_ should be the web site root directory
7. open the URL: http://yoursite.com/#configure to allow to configure the wanted resources
8. that's all!
