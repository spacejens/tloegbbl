## Description

tLoEG is a [Blood Bowl](https://www.bloodbowl.com/) club league based in Gothenburg, Sweden. This project is for collecting and displaying the statistics from our games. It consists of a couple of different software modules:

[backend](backend/README.md) is the heart of the system. It stores the data and performs various operations on it.

[bbldownload](bbldownload/README.md) performs a one-time download of data from a previous system, so it can be imported.

## Preparation

First, install NodeJS from <a href="https://nodejs.org/en">the NodeJS home page</a> and make sure it (node, npm, ...) is on your command line path.

Install the PNPM package manager and NestJS:
```bash
$ npm install -g pnpm
$ npm install -g @nestjs/cli
```
