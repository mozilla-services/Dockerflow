FROM node:10-slim

# add a non-privileged user for running the application
RUN groupadd --gid 10001 app && \
    useradd -g app --uid 10001 --shell /usr/sbin/nologin --create-home --home-dir /app app

WORKDIR /app

# Install node requirements and clean up unneeded cache data
COPY package.json package.json
RUN npm install && \
    npm cache clear --force && \
    rm -rf ~app/.node-gyp

# Finally copy in the app's source file
COPY . /app

ENV PORT=8000
USER app
ENTRYPOINT ["npm"]
CMD ["start"]
