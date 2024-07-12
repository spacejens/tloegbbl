import { Test, TestingModule } from '@nestjs/testing';
import { ApiUtilsService } from './api-utils.service';

describe('ApiUtilsService', () => {
  let service: ApiUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiUtilsService],
    }).compile();

    service = module.get<ApiUtilsService>(ApiUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
