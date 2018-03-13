FROM node:4.8.7-alpine

# add a non-privileged user for installing and running
# the application
RUN addgroup -g 10001 app && \
    adduser -D -G app -h /app -u 10001 app

WORKDIR /app

# Install node requirements and clean up unneeded cache data
COPY package.json package.json
USER app
RUN npm install && \
    npm cache clear && \
    rm -rf ~app/.node-gyp

# Finally copy in the app's source file
COPY . /app

ENTRYPOINT ["npm"]
CMD ["start"]
