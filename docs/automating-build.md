# Automating the Build

## EXPERIMENTAL!

To improve automation and build debugging it is recommended containers are built at CircleCI and then pushed to Docker Hub. The build and test logs are accessible for public projects. 

1. Use CircleCI to build and test your container. 
  - use the [circle.yml](https://github.com/mozilla-services/Dockerflow/blob/master/circle.yml) as a starting point 
2. If the container passes tests push it to Docker Hub with CircleCI
  - this requires cloudops set up the credentials in CircleCI. 
  - ping @mostlygeek with getting this set up
3. When the build is working add a CircleCI build badge to the projects README. 