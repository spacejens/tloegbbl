import { Test, TestingModule } from '@nestjs/testing';
import { ApolloApiClientService } from './apollo-api-client.service';

describe('ApolloApiClientService', () => {
  let service: ApolloApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApolloApiClientService],
    }).compile();

    service = module.get<ApolloApiClientService>(ApolloApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
