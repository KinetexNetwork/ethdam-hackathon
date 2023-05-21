FROM node:16-alpine3.17 AS development

WORKDIR /usr/src/referral-api

COPY package*.json ./

RUN npm install -g rimraf

RUN npm install -g @nestjs/cli

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16-alpine3.17 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/referral-api

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/referral-api/dist ./dist

CMD ["node", "dist/src/main"]