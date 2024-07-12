import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { HttpWrapperService } from './http-wrapper.service';
import { mock } from 'jest-mock-extended';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpService: HttpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        { provide: HttpWrapperService, useValue: mock<HttpWrapperService>() },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);
    httpService = module.get<HttpWrapperService>(HttpWrapperService);

    httpService.post = jest.fn().mockImplementation(() => {
      return {
        status: 200,
        data: {},
      };
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO Add unit tests for HTTP POST
});
