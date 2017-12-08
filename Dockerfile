FROM node:9.2.0

WORKDIR /prdog
COPY package.json .
RUN npm install
RUN npm install -g nodemon
RUN wget -O /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64
RUN chmod +x /usr/bin/dumb-init
COPY . .
EXPOSE 8080
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
