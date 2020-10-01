FROM node:alpine
WORKDIR /downloader
COPY package*.json ./
RUN npm ci --only=production
COPY index.js .
VOLUME ["/downloader/config.js", "/downloader/downloads"]
CMD [ "node", "index.js" ]