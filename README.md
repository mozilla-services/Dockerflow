# About

CloudOps supports docker containers for deployment. This repo is both documentation and demonstration of how to instrument your application to reduce deployment friction. 

## Dockerflow

The Dockerflow was designed with the goals of making deployment of applications easier and more transparent. It looks like this: 

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
4. Cloud Ops will use container for deployment
5. Other parties can use the *same* container for their needs


## Container Design Requirements

Don't panic. These are easy and will help everybody Go Faster (tm).

### A running container must...

1. Listen on `$PORT` for HTTP requests
2. Respond to `/__version__` with a [JSON version object](https://docs.google.com/document/d/1rGVyiLYvZyKE2oHcSVx-vBmQRKhs1kLLgn7xeCs6qKs/edit?usp=sharing)
3. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error
  * this endpoint is used by external monitoring to check the health of the service
  * it is recommended to check the app's dependencies (database, caches, etc) here
4. Respond to `/__lbheartbeat__` with an HTTP 200
  * used by the load balancer to check if the server and application is OK
  * do not include dependency checks as this check may trigger automatic node termination and replacement

### Run time configurations...

The preferred and recommended method is for the application to take its configuration from environment variables. This improves deployability and interopability. These should be defined and documented somewhere in the application's repository.

However, if configuration files are more suitable it should look for them in `$CONFIG_PATH`. This environment variable will be set and can point at either a single file or a directory. It is up to the application to use `$CONFIG_PATH` appropriately. 

The format of the configuration file(s) should be documented with examples. These require CloudOps to generate them at deploy time.

### Sending metrics and logs...

Applications can send statsd to `$STATSD_HOST` and `$STATD_PORT`. It is recommended to check that these environment variable are set before sending metrics. Access to the statsd dashboard is available on request from CloudOps.

Logs should be written to `stdout` and `stderr` in the mozlog format. Logs will be sent to an ElasticSearch cluster. This is an opt-in feature and must be requested from CloudOps to enable.


----
## Creating a Dockerfile

*note: this section needs work as our Dockerfile build recommendations has changed a bit.*

* [BrowserID Verifier: Node 4](https://github.com/mozilla/browserid-verifier/blob/master/Dockerfile)
* [Tokenserver: Python 2.7](https://github.com/mozilla-services/tokenserver/blob/master/Dockerfile)

Other Examples:

* [Tiles Onyx: Python 2.7](https://github.com/oyiptong/onyx/blob/master/Dockerfile)
* [Mozilla-IDP: node 0.8](https://github.com/mozilla-services/mozilla-idp/blob/master/Dockerfile)  
  * Very old school nodejs app that talks to our LDAP for Persona log ins. Requires installation of system package (libgmp-dev) for crypto math operations.  Example of cleaning up unnecessary files out of container
* [Shavar: Python 2.7](https://github.com/mozilla-services/shavar/blob/master/Dockerfile)


### Dockerfile Guidelines
*note: section requires work too.*

* Use the official Docker containers for a language. CloudOps pre-caches these on machines so downloading containers based on them is fast. 
  * [Node](https://hub.docker.com/_/node/)
  * [Python](https://hub.docker.com/_/python/)
  * [Golang](https://hub.docker.com/_/golang/)
* Build the smallest container you can
* Optimize for cachability. Put commands that make fewer changes (`apt-get`, `pip install ...`, `npm install`) earlier in the `Dockerfile`.
* Set a non-root user and group `app` in the container and run everything as this user
  * make the uid for the user `10001`
  * make the guid for the group `10001`

----
## About this Demo

todo:

* create circle.yml -- standarized and meant to copy/paste between projects
* create a version.json generator
* create a web application that serves content
* create standardized example scripts: 
  * `.dockerflow/build.sh`
  * `.dockerflow/test.sh`
* create tests to run in the container
* 