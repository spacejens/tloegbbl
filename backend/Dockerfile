FROM --platform=linux/amd64 node:18-alpine AS base

ARG PORT=3000
ENV PORT=${PORT}

RUN npm install -g pnpm

FROM base as dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --shamefully-hoist=true

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npx prisma generate --generator client
RUN pnpm build
RUN pnpm prune --prod

FROM base as deploy

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

USER 0
RUN mkdir -p /graphql-schema
RUN chmod 777 /graphql-schema

USER 1000
EXPOSE ${PORT}

# TODO Add health check by doing a GET request to /health (checking e.g. DB connectivity), see https://docs.docker.com/engine/reference/builder/#healthcheck
CMD [ "node", "dist/main.js" ]
