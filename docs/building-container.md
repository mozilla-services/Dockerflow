# Guidelines for Building a Container

* Put the application into `/app` within the container
* Set a non-root user and group `app` in the container and run everything as this user
  * make the uid for the user `10001`
  * make the guid for the group `10001`
* Use the Docker's base containers for a language. 
  * [Node](https://hub.docker.com/_/node/)
  * [Python](https://hub.docker.com/_/python/)
  * [Golang](https://hub.docker.com/_/golang/)
* Build the smallest container you can
* Optimize for cachability. Put commands that make fewer changes (`apt-get`, `pip install`, `npm install`) earlier in the `Dockerfile`.
