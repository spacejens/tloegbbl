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
      // TODO Configure cache, see https://www.apollographql.com/docs/react/caching/cache-configuration/
      cache: new InMemoryCache({
        resultCaching: false,
      }),
    });
  }
}
