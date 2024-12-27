import { Test, TestingModule } from '@nestjs/testing';
import { ApiUtilsService } from './api-utils.service';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('ApiUtilsService', () => {
  let service: ApiUtilsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiUtilsService,
        { provide: ConfigService, useValue: mock<ConfigService>() },
      ],
    }).compile();

    service = module.get<ApiUtilsService>(ApiUtilsService);
    configService = module.get<ConfigService>(ConfigService);

    configService.get = jest.fn().mockImplementation((propertyPath) => {
      switch(propertyPath) {
        case 'EXTERNAL_SYSTEM':
          return 'tloeg.bbleague.se';
        default:
          throw new Error(`Unexpected propertyPath ${propertyPath}`);
      }
    });
  });

  describe('externalId', () => {
    it('should wrap in object with external system', () => {
      expect(service.externalId('MyId')).toEqual({
        externalId: 'MyId',
        externalSystem: 'tloeg.bbleague.se',
      });
    });

    it('should ignore undefined values', () => {
      expect(service.externalId(undefined)).toBe(undefined);
    });
  });

  // TODO Add unit tests for getExternalId

  // TODO Add unit tests for sameExternalId
});
