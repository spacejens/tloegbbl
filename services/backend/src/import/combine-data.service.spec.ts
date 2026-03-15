import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';
import { ExternallyIdentifiable } from '@tloegbbl/api';

class TestData extends ExternallyIdentifiable {
  alpha?: string;
  beta?: string;
  startAt?: Date;
  endAt?: Date;
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

  describe('preferFound', () => {
    it('should ignore missing properties', () => {
      const requested: TestData = {};
      const found: TestData = {};
      const result: TestData = service.preferFound(requested, found);
      expect(result).toEqual({});
    });

    describe('id', () => {
      it('should use found id', () => {
        const requested: TestData = {};
        const found: TestData = { id: 22 };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ id: 22 });
      });

      it('should prefer found id', () => {
        const requested: TestData = { id: 11 };
        const found: TestData = { id: 22 };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ id: 22 });
      });

      it('should ignore requested id', () => {
        const requested: TestData = { id: 11 };
        const found: TestData = {};
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({});
      });
    });

    describe('externalIds', () => {
      it('should use found externalId', () => {
        const requested: TestData = {};
        const found: TestData = {
          externalIds: [
            { id: 1, externalId: 'extId', externalSystem: 'extSys' },
          ],
        };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [
            { id: 1, externalId: 'extId', externalSystem: 'extSys' },
          ],
        });
      });

      it('should add requested externalId', () => {
        const requested: TestData = {
          externalIds: [{ externalId: 'extId', externalSystem: 'extSys' }],
        };
        const found: TestData = {};
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [{ externalId: 'extId', externalSystem: 'extSys' }],
        });
      });

      it('should ignore DB ID of requested externalId', () => {
        const requested: TestData = {
          externalIds: [
            { id: 9, externalId: 'extId', externalSystem: 'extSys' },
          ],
        };
        const found: TestData = {};
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [{ externalId: 'extId', externalSystem: 'extSys' }],
        });
      });

      it('should include different externalIds', () => {
        const requested: TestData = {
          externalIds: [{ externalId: 'reqId', externalSystem: 'reqSys' }],
        };
        const found: TestData = {
          externalIds: [
            { id: 1, externalId: 'foundId', externalSystem: 'foundSys' },
          ],
        };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [
            { id: 1, externalId: 'foundId', externalSystem: 'foundSys' },
            { externalId: 'reqId', externalSystem: 'reqSys' },
          ],
        });
      });

      it('should merge matching externalIds', () => {
        const requested: TestData = {
          externalIds: [{ externalId: 'theId', externalSystem: 'theSys' }],
        };
        const found: TestData = {
          externalIds: [
            { id: 1, externalId: 'theId', externalSystem: 'theSys' },
          ],
        };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [
            { id: 1, externalId: 'theId', externalSystem: 'theSys' },
          ],
        });
      });

      it('should merge matching externalIds ignoring requested DB ID', () => {
        const requested: TestData = {
          externalIds: [
            { id: 9, externalId: 'theId', externalSystem: 'theSys' },
          ],
        };
        const found: TestData = {
          externalIds: [
            { id: 1, externalId: 'theId', externalSystem: 'theSys' },
          ],
        };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          externalIds: [
            { id: 1, externalId: 'theId', externalSystem: 'theSys' },
          ],
        });
      });
    });

    describe('string data', () => {
      it('should add requested data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = {};
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Requested' });
      });

      it('should keep found data', () => {
        const requested: TestData = {};
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should not overwrite found data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should overwrite found undefined', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { alpha: undefined };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Requested' });
      });

      it('should overwrite found null', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { alpha: null };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Requested' });
      });

      it('should not overwrite with requested undefined', () => {
        const requested: TestData = { alpha: undefined };
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should not overwrite with requested null', () => {
        const requested: TestData = { alpha: null };
        const found: TestData = { alpha: 'Found' };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Found' });
      });

      it('should merge different data', () => {
        const requested: TestData = { alpha: 'Requested' };
        const found: TestData = { beta: 'Found' };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ alpha: 'Requested', beta: 'Found' });
      });
    });

    describe('date data', () => {
      it('should add requested data', () => {
        const requested: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const found: TestData = {};
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 0, 1, 12) });
      });

      it('should keep found data', () => {
        const requested: TestData = {};
        const found: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 0, 1, 12) });
      });

      it('should not overwrite found data', () => {
        const requested: TestData = { startAt: new Date(2024, 11, 31, 12) };
        const found: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 0, 1, 12) });
      });

      it('should overwrite found undefined', () => {
        const requested: TestData = { startAt: new Date(2024, 11, 31, 12) };
        const found: TestData = { startAt: undefined };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 11, 31, 12) });
      });

      it('should overwrite found null', () => {
        const requested: TestData = { startAt: new Date(2024, 11, 31, 12) };
        const found: TestData = { startAt: null };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 11, 31, 12) });
      });

      it('should not overwrite with requested undefined', () => {
        const requested: TestData = { startAt: undefined };
        const found: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 0, 1, 12) });
      });

      it('should not overwrite with requested null', () => {
        const requested: TestData = { startAt: null };
        const found: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({ startAt: new Date(2024, 0, 1, 12) });
      });

      it('should merge different data', () => {
        const requested: TestData = { startAt: new Date(2024, 0, 1, 12) };
        const found: TestData = { endAt: new Date(2024, 11, 31, 12) };
        const result: TestData = service.preferFound(requested, found);
        expect(result).toEqual({
          startAt: new Date(2024, 0, 1, 12),
          endAt: new Date(2024, 11, 31, 12),
        });
      });
    });
  });
});
