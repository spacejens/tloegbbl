import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { HttpWrapperService } from './http-wrapper.service';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let configService: ConfigService;
  let httpService: HttpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        { provide: ConfigService, useValue: mock<ConfigService>() },
        { provide: HttpWrapperService, useValue: mock<HttpWrapperService>() },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);

    configService = module.get<ConfigService>(ConfigService);
    configService.get = jest.fn().mockImplementation((propertyPath) => {
      switch(propertyPath) {
        case 'BACKEND_API_URL':
          return 'http://localhost:3000/';
        default:
          throw new Error(`Unexpected propertyPath ${propertyPath}`);
      }
    });

    httpService = module.get<HttpWrapperService>(HttpWrapperService);
  });

  describe('post', () => {
    const postHeaders = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    it('expects HTTP 201 for successful POST', async () => {
      const expectedResult = {
        status: 201,
        data: {},
      };
      httpService.post = jest.fn().mockReturnValue(expectedResult);
      const result = await service.post('some/path', { argument: 'value' });
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:3000/some/path',
        { argument: 'value' },
        postHeaders,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it('fails when server provides unexpected status code', async () => {
      const unexpectedStatusResult = {
        status: 200,
        data: {},
      };
      httpService.post = jest.fn().mockReturnValue(unexpectedStatusResult);
      await expect(service.post('some/path', {})).rejects.toThrow();
    });

    it('fails when server returns data.errors', async () => {
      const dataErrorsResult = {
        status: 201,
        data: {
          errors: [],
        },
      };
      httpService.post = jest.fn().mockReturnValue(dataErrorsResult);
      await expect(service.post('some/path', {})).rejects.toThrow();
    });
  });
});
