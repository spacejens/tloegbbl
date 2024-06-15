## Description

tLoEG is a [Blood Bowl](https://www.bloodbowl.com/) club league based in Gothenburg, Sweden. This project is for collecting and displaying the statistics from our games. It consists of a couple of different software modules:

[backend](backend) is the heart of the system. It stores the data and performs various operations on it.

[bbldownload](bbldownload) performs a one-time download of data from a previous system, so it can be imported.

[bblimport](bblimport) transforms and imports data from a previous system.

## Preparation

First, install NodeJS from <a href="https://nodejs.org/en">the NodeJS home page</a> and make sure it (node, npm, ...) is on your command line path.

Install the PNPM package manager and NestJS:
```bash
$ npm install -g pnpm
$ npm install -g @nestjs/cli
```

In order to deploy the system locally, you also need to install [Docker Desktop](https://docs.docker.com/desktop/).

In order to access the local database, you will need to install a Postgres client (e.g. psql).

## Deploying locally

This command will build and deploy all deployable modules of the system:
```bash
$ docker compose up --build
```

To undeploy, use the following command:
```bash
$ docker compose down
```

## Accessing the local database

To connect to the local database, use the following command (and provide the test password):
```bash
$ PGOPTIONS="--search-path=tloegbbl" psql -h localhost -p 3001 -U test tloegbbl
```

## Database development with Prisma

All data model and database structure changes are driven through [Prisma](https://www.prisma.io/docs), using the following steps:
- Edit the [schema.prisma](backend/prisma/schema.prisma) file to modify the model.
- Update the generated source code using `npx prisma generate`
- Develop and unit test functionality as normal
- To generate SQL changes and update the database, use `npx prisma migrate dev --name <name of the change>`
- Commit schema, generated code, and (ideally) your own code together to clarify the relationship between them

## GraphQL schema generation

The Docker Compose deployment generates a GraphQL schema file for the backend inside the backend image, in the `graphql-schema`
directory. This file is manually copied to the directory with the same name in the repo.

When the backend schema has been updated, the client applications need to generate new code from it.
This is done by using `pnpm run generate-graphql-types` inside each client application, and possibly updating code to fix issues.
