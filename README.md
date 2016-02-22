[![Docker Build Status](https://circleci.com/gh/mozilla-services/Dockerflow/tree/master.svg?style=shield&circle-token=c7c606e039cdccd2380782672ac12b2e85550295)](https://circleci.com/gh/mozilla-services/Dockerflow)


# About

Dockerflow is a specification for how to dockerize Cloud Services' web applications so they are easy to deploy and share common behaviour. 

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

1. Accept its configuration through environment variables
1. Listen on environment variable `$PORT` for HTTP requests
1. Respond to `/__version__` with a JSON object like: `{"source":"url to repo", "version":"human readable string", "commit":"git hash"}`
1. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error. This should dependent services like the database to also ensure they are healthy.
1. Respond to `/__lbheartbeat__` with an HTTP 200. This is for load balancer checks and should **not** check any dependent services.
1. Send logs to `stdout` or `stderr`. The recommended format is a JSON schema that [Heka](https://github.com/mozilla-services/heka) understands. This is known as mozlog and libraries are available for [nodejs](https://www.npmjs.com/package/mozlog) and [python](https://github.com/mozilla-services/mozservices/blob/master/mozsvc/util.py#L106).

### Dockerfile requirements

1. Sources should be copied to the `/app` directory in the container.
1. Create an `app` group with a GID of `10001`.
1. Create an `app` user with a UID of `10001`. This should be in the `app` group.
1. Have a `USER app` command to set the default user.
1. Have a `ENTRYPOINT` and `CMD` commands which starts the service and listens on `$PORT`.

See [Guidelines for Building a Container](docs/building-container.md) for more tips on making a production ready container.

## Automated CI and Container creation

See [Automating The Build](docs/automating-build.md) for information on using CI tools to build, test and deploy the container to Dockerhub.

## Contributing
* [Contribution Guidelines](CONTRIBUTE.md)





