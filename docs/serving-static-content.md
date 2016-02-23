# Serving Static Content

Dockerflow is focused on making backend code easy to deploy and run. It purposefully avoids adding requirements for how to serve front end assets. However, it is unrealistic to ignore the tight coupling between frontend assets and backend functionality. This document offers recommendations for developers on how to bundle static assets into their containers to simplify hosting. 

It is up to the developer to choose the suitable method based on where their application and its assets will be hosted.

## Generated static assets

When using transpiling tools like [bablejs](https://babeljs.io/), [sass](http://sass-lang.com/) and [browserify](http://browserify.org/) only have their output and not the source in the container. Use a [.dockerignore](https://github.com/mozilla/testpilot/blob/master/.dockerignore) file to exclude source directories. If source materials are required it is OK to include them in the container to be used at run time. 

## How to serve static content

### Serve assets with the application

This is the recommended approach. It is the most idiomatic usage of containers to hide application dependencies from the host machine. For Dockerflow applications the docker host only needs to provide a `$PORT` and need not be concerned about what's inside. 

Additionally the application has full control over HTTP headers. Business logic for cache controls lives with the rest of the business rules. Downstream CDNs, proxies and web caches are simplified as logic does not need to be replicated in multiple places. 

Applications are more portable when they serve their own static assets. PaaS providers like Heroku, Google Cloud Platform, AWS Elastic Beanstalk and many others can directly host the application without customization.

The downside is that applications may be more complex with additional dependencies. They need to read bytes from disk and turn it into an HTTP response. Also serving static assets through an application is often slower than an optimized web server like nginx. 

If performance is important it is recommended to use nginx as a reverse *caching* proxy in front of the container. nginx will respect `Cache-Control` headers and serve assets as fast as the machine can handle. This setup would be dependent on the hosting service.

### Serve assets outside the container

An alternative is to copy static assets out and serve them elsewhere. This approach is discouraged but is acceptable for specific application requirements. 

In this situation a process will copy out the static assets, relocate them and configure external hosting services. 

Copying out assets can be done like so:

```
docker run --rm \
   -v /path/on/host:/path/in/container \          [1]
   <repo>:<tag> \
   cp -R /app/path/to/static/* /path/in/container [2]
```

1. A directory on the host machine is volume mounted into the container
2. A shell command is used to copy assets out onto the host machine

Serving assets outside the container has additional overhead and risks. Changes to the hosting service, the assets or the configuration of the container can cause service disruption if things aren't kept in sync. 