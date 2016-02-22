[![Docker Build Status](https://circleci.com/gh/mozilla-services/Dockerflow/tree/master.svg?style=shield&circle-token=c7c606e039cdccd2380782672ac12b2e85550295)](https://circleci.com/gh/mozilla-services/Dockerflow)


# About

Dockerflow is a specification for creating Docker containers for deploying web services. 

The specification is this README.md file. This repo contains a reference application that will change with the specification. See the [Contribution document](CONTRIBUTE.md) for details on suggesting changes and providing feedback.

**This is still a work in progress and may subject to change.** When the specification has stabilized a tag will be created on this repository.

## Dockerflow

It looks like this: 

````
  +-(1)--+         +-(2)------------+        +-(3)-------+        +-(4)--------+
  |Code  |         |  CI build and  |        |   Docker  |        |   Public   |
  |Push  | ------> |tests container | -----> |    Hub    | -----> | Deployment |
  +------+         +----------------+        +-----------+        +------------+

````

1. Code pushed to github triggers the flow
2. CI builds and tests the container
3. Verified containers are pushed to Docker Hub
4. Container is deployed into a live system

## Dockerflow Specification

### A containerized app must...

1. Listen on environment variable `$PORT` for HTTP requests
2. Respond to `/__version__` with a JSON object like: `{"source":"url to repo", "version":"human readable string", "commit":"git hash"}`
3. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error
  * used by external monitoring to check if the service is healthy
  * include checks for the app's dependencies (database, caches, etc)
4. Respond to `/__lbheartbeat__` with an HTTP 200
  * used by load balancers to check if the host machine is healthy
  * do not include dependency checks

### Configuration

Use environment variables for configuration. 

### Logs

Send plain text logs `stdout` and/or `stderr`. 

The recommended format is a JSON schema that [Heka](https://github.com/mozilla-services/heka) understands. This is also known as mozlog. Libraries are available for [nodejs](https://www.npmjs.com/package/mozlog) and [python](https://github.com/mozilla-services/mozservices/blob/master/mozsvc/util.py#L106) to make implementation easier.

## Additional Reading

* [Guidelines for Building a Container](docs/building-container.md)
* [Automating the container build and push](docs/automating-build.md)
* [Contribution Guidelines](CONTRIBUTE.md)




