# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:alpine
RUN apk add  --no-cache imagemagick
WORKDIR /usr/src/app
COPY package*.json ./
RUN mkdir -p /usr/src/app/uploads
RUN mkdir -p /usr/src/app/results
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ] 
# https://stackoverflow.com/a/25347216/747456ls 