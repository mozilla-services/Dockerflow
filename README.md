[![Docker Build Status](https://circleci.com/gh/mozilla-services/Dockerflow/tree/master.svg?style=shield&circle-token=c7c606e039cdccd2380782672ac12b2e85550295)](https://circleci.com/gh/mozilla-services/Dockerflow)


# Dockerflow

Dockerflow is a specification for automated building, testing and publishing of docker web application images that comply to a common set of behaviours. Compliant images are simpler to deploy, monitor and manage in production.

The specification is this README.md file. This repo contains a reference application that will change with the specification. See the [Contribution document](CONTRIBUTE.md) for details on suggesting changes and providing feedback.

## Automated Creation Pipeline

````
  +-(1)--+         +-(2)-------------+        +-(3)-------+        +-(4)--------+
  | Code |         |  CI builds and  |        |   Docker  |        | Container  |
  | Push | ------> | tests container | -----> |    Hub    | -----> | Deployment |
  +------+         +-----------------+        +-----------+        +------------+

````

1. A Code push triggers automated image building
2. CI builds and tests the image
3. Tested images are published to Docker Hub.
4. Images are pulled from Docker Hub to be used

## Specification

The specification has requirements that a container must comply with. Recommendations are optional but encouraged if they are suitable for the application.

### Building and Testing

Dockerflow allows any automated build and test tool that meets these requirements:

1. Able to trigger a build from a code change like a pull request or a merge.
1. Able to run tests on the code and the application in the container.
1. Able to manually trigger a previous build and test.
1. Able to publish container to Docker Hub.
1. Able to provide a build and test log.
1. Secure and keeps secrets from being exposed.

### Containerized App Requirements

When the application is ran in the container it must:

1. Accept its configuration through environment variables.
1. Listen on environment variable `$PORT` for HTTP requests.
1. Must have a [JSON version object](docs/version_object.md) at `/app/version.json`.
1. Respond to `/__version__` with the contents of `/app/version.json`.
1. Respond to `/__heartbeat__` with a HTTP 200 or 5xx on error. This should check backing services like a database for connectivity and return a payload indicating the status of backing services and components in a machine-readable format like JSON.
1. Respond to `/__lbheartbeat__` with an HTTP 200. This is for load balancer checks and should **not** check backing services.
1. Send text logs to `stdout` or `stderr`.
1. Serve its own [static content](docs/serving-static-content.md).

### Dockerfile requirements

1. Sources should be copied to the `/app` directory in the container.
1. Create an `app` group with a GID of `10001`.
1. Create an `app` user with a UID of `10001` and is a member of the `app` group.
1. Have both `ENTRYPOINT` and `CMD` instructions to start the service.
1. Have a `USER app` instruction to set the default user.

### Optional Recommendations

1. Log to `stdout` in the
   [mozlog](https://wiki.mozilla.org/Firefox/Services/Logging) json schema.
1. [Containers should be optimized for production use](docs/building-container.md).
1. Listen on port 8000.

## Contributing
* [Contribution Guidelines](CONTRIBUTE.md)
