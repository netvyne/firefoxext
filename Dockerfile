FROM node:16-slim
COPY package.json /firefoxext/
COPY yarn.lock /firefoxext/
RUN cd firefoxext && yarn install