## Description

This module transforms data downloaded by [bbldownload](../bbldownload) and imports it into the [backend](../backend).

Since this was a one-time operation and this module operates by parsing downloaded HTML files, it might no longer perform as expected if used at a future date.

The module is designed to be used locally, but still has boilerplate source code to be able to deploy (although not in a useful way).

## Configuration
```bash
cp .env.example .env
```

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
