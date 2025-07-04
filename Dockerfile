FROM node:20-alpine

WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

USER node

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN mkdir -p dist

EXPOSE 3000

CMD ["yarn", "start:dev"]
