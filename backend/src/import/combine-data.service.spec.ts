import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';
import { ExternallyIdentifiable } from '../dtos';

class TestData extends ExternallyIdentifiable {
  alpha?: string;
  beta?: string;
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
    it('should ignore missing properties', () => {
      const requested: TestData = {};
      const found: TestData = {};
      const result: TestData = service.combineData(requested, found);
      expect(result).toEqual({});
    });

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
    });

    // TODO Unit tests for external ID (remember to check that requested DB IDs are ignored, as we do above)

    describe('data', () => {
      it('should add requested data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = {};
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ alpha: 'Requested' });
      });

      it('should keep found data', () => {
        const requested: TestData = {};
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should not overwrite found data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should merge different data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { beta: 'Found' };
        const result: TestData = service.combineData(requested, found);
        expect(result).toEqual({ alpha: 'Requested', beta: 'Found' });
      });
    });

    // TODO Remove this test case once the cleaner test cases above fully replace it
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
  });

  // TODO Unit tests for data combination using directives (e.g. allowing overwrite of found data)
});
