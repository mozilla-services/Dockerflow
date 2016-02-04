FROM node:4.2.4

# add a non-privileged user for installing and running
# the application
RUN groupadd --gid 10001 app && \
    useradd --uid 10001 --gid 1001 --home /app --create-home app

WORKDIR /app

# Install node requirements and clean up unneeded cache data
COPY package.json package.json
RUN su app -c "npm install" && \
    npm cache clear && \
    rm -rf ~app/.node-gyp

# Finally copy in the app's source file
COPY . /app

USER app
ENTRYPOINT ["npm"]
CMD ["start"]
