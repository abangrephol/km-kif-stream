FROM node:12-alpine

WORKDIR /app

RUN apk upgrade -U \
  && apk add ca-certificates ffmpeg libva-intel-driver \
  && rm -rf /var/cache/*

COPY . /app

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install --silent

RUN yarn global add nodemon

RUN which ffmpeg

EXPOSE 8000

EXPOSE 8080

EXPOSE 1935
