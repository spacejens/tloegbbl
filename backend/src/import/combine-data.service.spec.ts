import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';
import { Coach } from '../dtos';

describe('CombineDataService', () => {
  let service: CombineDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CombineDataService],
    }).compile();

    service = module.get<CombineDataService>(CombineDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO Rewrite unit tests to be generic, using test-specific DTOs

  describe('no directives', () => {
    it('should combine requested and found', () => {
      const requested: Coach = {
        name: 'Requested Coach',
        externalIds: [
          {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
      };
      const found: Coach = {
        id: 47,
        name: 'Found Coach',
      };
      const result = service.combineData(requested, found);
      expect(result).toEqual({
        id: 47,
        externalIds: [
          {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
        name: 'Found Coach',
      });
    });

    // TODO More test cases for data combination
  });

  // TODO Unit tests for data combination using directives (e.g. allowing overwrite of found data)
});
