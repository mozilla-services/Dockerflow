[![Docker Build Status](https://circleci.com/gh/mozilla-services/Dockerflow/tree/master.svg?style=shield&circle-token=c7c606e039cdccd2380782672ac12b2e85550295)](https://circleci.com/gh/mozilla-services/Dockerflow)


# Dockerflow

Dockerflow is a specification for automated building, testing and publishing of web application containers that comply to a common set of behaviours. Compliant web containers are simpler to deploy, monitor and manage in production.

The specification is this README.md file. This repo contains a reference application that will change with the specification. See the [Contribution document](CONTRIBUTE.md) for details on suggesting changes and providing feedback.

**This is still a work in progress and may subject to change.** When the specification has stabilized a tag will be created on this repository.

## Automated Creation Pipeline

````
  +-(1)--+         +-(2)-------------+        +-(3)-------+        +-(4)--------+
  | Code |         |  CI builds and  |        |   Docker  |        | Container  |
  | Push | ------> | tests container | -----> |    Hub    | -----> | Deployment |
  +------+         +-----------------+        +-----------+        +------------+

````

1. Code pushed to github triggers the flow
2. CI builds and tests the container
3. Tested containers are published to Docker Hub
4. Container pull from Docker Hub to be used

## Specification

The specification has requirements and recommendations. 

### Building and Testing

Dockerflow allows any automated build and test tool that meets these requirements:

1. Able to trigger a build from a code change like a pull request or a merge.
1. Able to run tests on the code and the application in the container.
1. Able to manually re-run a build and test.
1. Able to publish container to Docker Hub
1. Able to provide a build and test log.
1. Reasonably secure and keep secrets from being exposed.

### Containerized App Requirements

1. Accept its configuration through environment variables
1. Listen on environment variable `$PORT` for HTTP requests
1. Respond to `/__version__` with a JSON object like: `{"source":"url to repo", "version":"human readable string", "commit":"git hash"}`
1. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error. This should check backing services like a database for connectivity.
1. Respond to `/__lbheartbeat__` with an HTTP 200. This is for load balancer checks and should **not** check backing services.
1. Send text logs to `stdout` or `stderr`. 
1. [Static files should be served by the application](docs/serving-static-content.md)

### Dockerfile requirements

1. Sources should be copied to the `/app` directory in the container.
1. Create an `app` group with a GID of `10001`.
1. Create an `app` user with a UID of `10001`. Should be a member of the `app` group.
1. Use `USER app` to set the default user.
1. Have a `ENTRYPOINT` and `CMD` commands which starts the service.

### Containerized App Recommendations

1. [Containers should be optimized for production use](docs/building-container.md)
1. Send logs to `stdout` in the [mozlog](docs/mozlog.md) json schema. 

## Contributing
* [Contribution Guidelines](CONTRIBUTE.md)