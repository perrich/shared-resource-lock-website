# shared-resource-lock-website
A website to manage shared resources locks using PHP and Angular 2.

Provide a way to manage limited resource access by creating an easy lock mechanism and a web dashboard.

## Details

* PHP part contains a REST webservice to manage the resource list. A single JSON file is used as persistance layer.
* Website is created using Angular 2. It provides a dashboard view and a resource details view.
* Gulp script is used to build and package the Web site 

## Prerequisites
* Node.JS (npm/gulp)
* Gulp (build)
* PHP (server side shared management)


## How to test it?

You only need 4 steps :

1. Run "composer install" in the _app_ folder.
2. Run "npm install" in the _source_ folder
3. Edit the _resource.service.ts_ to define the right URL of the webservice, for instance http://localhost/resources
4. Run "gulp serve"

## How to deploy?
1. copy the below listed folders:
 * _app_
 * _dist_
 * _vendor_
2. modify the _app/config.json_ file
3. modify the _app/db.json_ file to define your resources
4. _dist_ should be the web site root directory
5. that's all!
