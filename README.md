[![Docker Build Status](https://circleci.com/gh/mozilla-services/Dockerflow/tree/master.svg?style=shield&circle-token=c7c606e039cdccd2380782672ac12b2e85550295)](https://circleci.com/gh/mozilla-services/Dockerflow)

# About

Dockerflow is meant to be part of Cloud Service's deployment pipeline. Distributing our applications with Docker simplifies deployment and makes our services more accessible to the community. 

The specification for Dockerflow is this README.md file. This repo also contains a reference application that will change as the specification changes. See the Contribution section for details on suggesting changes and providing feedback.

## Dockerflow

It looks like this: 

````
  +-(1)--+         +-(2)------------+        +-(3)--------+        +-(4)--------+
  |Code  |         |  CI build and  |        | Docker Hub |        |  CloudOps  |
  |Push  | ------> |tests container | -----> |            | -----> | Deployment |
  +------+         +----------------+        +------------+        +------------+
                                                   |
                                                   v
                                        +-(5)-----------------+
                                        |        Other        |
                                        |     Deployments     |
                                        |(PaaS, intranet, etc)|
                                        +---------------------+

````

1. Code pushed to github triggers the flow
2. CI builds and tests the container
3. Verified containers are pushed to Docker Hub
4. Cloud Ops will use the container for deployment
5. Other parties can use the *same* container for private installations or projects


## Container Requirements

Don't panic. The list is short and easy to implement.

### A containerized app must...

1. Listen on `$PORT` for HTTP requests
2. Respond to `/__version__` with a [JSON version object](https://docs.google.com/document/d/1rGVyiLYvZyKE2oHcSVx-vBmQRKhs1kLLgn7xeCs6qKs/edit?usp=sharing)
3. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error
  * this endpoint is used by external monitoring to check the health of the service
  * it is recommended to check the app's dependencies (database, caches, etc) here
4. Respond to `/__lbheartbeat__` with an HTTP 200
  * used by the load balancer to check if the server and application is OK
  * do not include dependency checks as this check may trigger automatic node termination and replacement


### Configuration

Only use environment variables for configuration. 

### Sending metrics and logs

CloudOps provides two types of metrics dashboards, Kibana and statsd. 

Statsd data should be sent to `$STATSD_HOST` and `$STATD_PORT`. Statsd is always available to the application. Access to the statsd dashboard is available on request from CloudOps. 

Applications logs should be written to `stdout` and `stderr` in the [mozlog format](https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=42895640). These will be sent to an Elastic Search cluster and accessible via Kibana. This feature is enabled on request. 


## Building the Container

### Dockerfile Examples 

* [BrowserID Verifier - Node 4](https://github.com/mozilla/browserid-verifier/blob/master/Dockerfile)
* [Tokenserver - Python 2.7](https://github.com/mozilla-services/tokenserver/blob/master/Dockerfile)

### Dockerfile Guidelines

* Put the application into `/app` within the container
* Use the Docker's base containers for a language. CloudOps pre-caches these on machines. 
  * [Node](https://hub.docker.com/_/node/)
  * [Python](https://hub.docker.com/_/python/)
  * [Golang](https://hub.docker.com/_/golang/)
* Build the smallest container you can
* Optimize for cachability. Put commands that make fewer changes (`apt-get`, `pip install`, `npm install`) earlier in the `Dockerfile`.
* Set a non-root user and group `app` in the container and run everything as this user
  * make the uid for the user `10001`
  * make the guid for the group `10001`


### Automating the Build

To improve automation and transparency it is recommended containers are built at CircleCI and then pushed to Docker Hub. The build and test logs are accessible for public projects. This makes collaboration and contribution easier from both the community and Mozilla paid contributors. 

1. Use CircleCI to build and test your container. 
  - use the [circle.yml](https://github.com/mozilla-services/Dockerflow/blob/master/circle.yml) as a starting point 
2. If the container passes tests push it to Docker Hub with CircleCI
  - this requires cloudops set up the credentials in CircleCI. 
  - ping @mostlygeek with getting this set up
3. When the build is working add a CircleCI build badge to the projects README. 

## Contributing

### Getting help and reporting bugs

* To get help with implementation, open a new issue and tag it with `[question]`.
* If you find a bug, create a new issue and tag it with `[bug]`. 

### Proposing changes

* Open a new pull request with your changes