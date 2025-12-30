FROM --platform=linux/amd64 node:18-alpine AS base

ARG PORT=3000
ENV PORT=${PORT}

RUN npm install -g pnpm

FROM base as dependencies

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
# TODO Filter install?

FROM dependencies AS build

WORKDIR /app
RUN pnpm --filter backend... build
RUN pnpm --filter backend --legacy deploy /app/pruned
RUN cd /app/pruned && pnpm prisma generate

FROM base as deploy

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/pruned .

USER 1000
EXPOSE ${PORT}

# TODO Add health check by doing a GET request to /health (checking e.g. DB connectivity), see https://docs.docker.com/engine/reference/builder/#healthcheck
CMD [ "node", "dist/main.js" ]
