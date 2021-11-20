FROM node:alpine
RUN apk add  --no-cache imagemagick
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]