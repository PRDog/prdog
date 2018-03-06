FROM node:carbon-alpine

WORKDIR /prdog
COPY package*.json yarn.lock ./
RUN yarn install && \
    yarn global add nodemon && \
    apk add --no-cache curl && \
    curl -Lo /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 && \
    chmod +x /usr/bin/dumb-init
COPY . .
EXPOSE 8080
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "start"]
