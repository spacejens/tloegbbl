import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';
import { ExternallyIdentifiable } from '../dtos';

class TestData extends ExternallyIdentifiable {
  mandatoryData: string;
}

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

  describe('no directives', () => {
    it('should combine requested and found', () => {
      const requested: TestData = {
        mandatoryData: 'Requested',
        externalIds: [
          {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
      };
      const found: TestData = {
        id: 47,
        mandatoryData: 'Found',
      };
      const result: TestData = service.combineData(requested, found);
      expect(result).toEqual({
        id: 47,
        externalIds: [
          {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
        mandatoryData: 'Found',
      });
    });

    // TODO Unit test checking that found DB ID is never overwritten (for neither object itself or for external IDs)

    // TODO More test cases for data combination
  });

  // TODO Unit tests for data combination using directives (e.g. allowing overwrite of found data)
});
