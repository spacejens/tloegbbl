import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApolloApiClientService extends ApolloClient<NormalizedCacheObject> {
  constructor() {
    super({
      // TODO Get API URL from configuration
      uri: 'http://localhost:3000/api',
      cache: new InMemoryCache(),
    });
  }
}
