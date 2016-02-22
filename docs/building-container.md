# Guidelines for Building a Container

### Dockerfile Examples 

* [BrowserID Verifier - Node 4](https://github.com/mozilla/browserid-verifier/blob/master/Dockerfile)
* [Tokenserver - Python 2.7](https://github.com/mozilla-services/tokenserver/blob/master/Dockerfile)
* [TestPilot - Python 3](https://github.com/mozilla/testpilot/blob/master/Dockerfile)
* [Universal Search Recommendation - Python 3.5](https://github.com/mozilla/universal-search-recommendation/blob/master/app/Dockerfile)

### Dockerfile Guidelines

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
