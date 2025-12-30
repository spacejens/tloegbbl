## Description

This module downloads data from TP as a one-time operation for each historical season, and stores it locally for later import into the [backend](../backend).

The module is designed to be used locally, but still has boilerplate source code to be able to deploy (although not in a useful way).

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
