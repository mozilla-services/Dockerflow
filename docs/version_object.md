# Version Object

A Dockerflow containers are required to respond to requests to `/__version__` with a JSON object that looks like:

```json
{
  "source" : "https://github.com/mozilla-services/Dockerflow", 
  "version": "release tag or string for humans", 
  "commit" : "<git hash>",
  "build"  : "uri to CI build job"
}
```

The version objects provides enough information to identify:

1. Where to find the source code
2. The release version of the application
  - can be left blank for non-release versions
3. The commit hash for the containerized application
4. A link to the CI tool's build job that created the image