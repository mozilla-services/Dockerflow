# Guidelines for Building a Container
* CloudOps requires that you start with an [Official](https://docs.docker.com/docker-hub/official_repos/) docker container specific to the primary language of the application being built. This means you should start with one of the following images:
  * [Node](https://hub.docker.com/_/node/)
  * [Python](https://hub.docker.com/_/python/)
  * [Golang](https://hub.docker.com/_/golang/)

 Official images have the benefit of receiving timely security updates and access to build and modify them is limited to dedicated maintainers.

 If there is a specific reason you wish to deviate from this recommendation and you have read [this](https://docs.docker.com/docker-hub/official_repos/) you can use a different image, including the -slim/-alpine variants of the official language images. You should be prepared for questions about this decision.

 [Here](https://hub.docker.com/explore/) is a list of the officially supported docker images.

* Build the smallest container you can. If you're looking to shrink the size of your Docker image, you should consider using the -slim/-alpine tags within each Official image. They ship without build tools, or use an entirely different toolchain that lets you start with a smaller base image.
* Optimize for cachability. Put commands that make fewer changes (`apt-get`, `pip install`, `npm install`) earlier in the `Dockerfile`.
* Put the application into `/app` within the container
* Set a non-root user and group `app` in the container and run everything as this user
  * make the uid for the user `10001`
  * make the guid for the group `10001`
  * this user is for privilege deescalation and should have read-only access to files
