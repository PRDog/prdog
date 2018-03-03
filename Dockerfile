FROM node:carbon

WORKDIR /prdog
COPY package*.json ./
RUN npm install && \
    npm install -g nodemon && \
    wget -O /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 && \
    chmod +x /usr/bin/dumb-init
COPY . .
EXPOSE 8080
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
