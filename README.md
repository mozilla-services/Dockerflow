# About

CloudOps supports docker containers for deployment. This repo is both documentation and demonstration of how to instrument your application to reduce deployment friction. 

## Dockerflow

The Dockerflow was designed with the goals of making deployment of applications easier and more transparent. It looks like this: 

````
+-(1)--+         +-(2)------------+        +-(3)--------+        +-(4)--------+
|Code  |         |  CI build and  |        | Docker Hub |        |  CloudOps  |
|Push  | ------> |tests container | -----> |            | -----> | Deployment |
+------+         +----------------+        +------------+        +------------+
                                                 |
                                                 v
                                      +-(5)-----------------+
                                      |        Other        |
                                      |     Deployments     |
                                      |(PaaS, intranet, etc)|
                                      +---------------------+

````

1. Code pushed to github triggers the flow
2. CI builds and tests the container
3. Verified containers are pushed to Docker Hub
4. Cloud Ops will use container for deployment
5. Other parties can use the *same* container for their needs

## Creating a Dockerfile

(todo)

## Best Practices
(todo)

## Examples
(todo)

## About this Demo

(todo)