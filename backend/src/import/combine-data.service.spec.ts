import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';
import { ExternallyIdentifiable } from '../dtos';

class TestData extends ExternallyIdentifiable {
  alpha?: string;
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
    describe('id', () => {
      it('should use found id', () => {
        const requested: TestData = {};
        const found: TestData = { id: 22 };
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ id: 22 });
      });

      it('should prefer found id', () => {
        const requested: TestData = { id: 11 };
        const found: TestData = { id: 22 };
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ id: 22 });
      });

      it('should ignore requested id', () => {
        const requested: TestData = { id: 11 };
        const found: TestData = {};
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({});
      });

      it('should ignore missing id', () => {
        const requested: TestData = {};
        const found: TestData = {};
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({});
      });
    });

    it('should combine requested and found', () => {
      const requested: TestData = {
        alpha: 'Requested',
        externalIds: [
          {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
      };
      const found: TestData = {
        id: 47,
        alpha: 'Found',
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
        alpha: 'Found',
      });
    });

    // TODO Unit test checking that found DB ID is never overwritten (for neither object itself or for external IDs)

    // TODO More test cases for data combination
  });

  // TODO Unit tests for data combination using directives (e.g. allowing overwrite of found data)
});
