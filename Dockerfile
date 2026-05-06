ARG NODE_VERSION=24.15.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package*.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM base AS final
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/dist ./dist
CMD yarn dev