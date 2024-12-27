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

  describe('getFirstExternalId', () => {
    it('returns first (alphabetically) external ID for correct system', () => {
      const result = service.getFirstExternalId({
        externalIds: [
          {
            externalId: 'id0',
            externalSystem: 'wrongSystem',
          },
          {
            externalId: 'id2',
            externalSystem: 'tloeg.bbleague.se',
          },
          {
            externalId: 'id1',
            externalSystem: 'tloeg.bbleague.se',
          },
          {
            externalId: 'id3',
            externalSystem: 'tloeg.bbleague.se',
          },
        ],
      });
      expect(result).toStrictEqual('id1');
    });

    it('returns undefined if no external IDs are found', () => {
      const result = service.getFirstExternalId({});
      expect(result).toBeUndefined();
    });

    it('returns undefined if external IDs array is empty', () => {
      const result = service.getFirstExternalId({
        externalIds: [],
      });
      expect(result).toBeUndefined();
    });
  });

  describe('getExternalIds', () => {
    it('returns all external IDs for correct system', () => {
      const result = service.getExternalIds({
        externalIds: [
          {
            externalId: 'id0',
            externalSystem: 'wrongSystem',
          },
          {
            externalId: 'id1',
            externalSystem: 'tloeg.bbleague.se',
          },
          {
            externalId: 'id2',
            externalSystem: 'tloeg.bbleague.se',
          },
        ],
      });
      expect(result).toStrictEqual(['id1','id2']);
    });

    it('sorts returned IDs', () => {
      const result = service.getExternalIds({
        externalIds: [
          {
            externalId: 'id2',
            externalSystem: 'tloeg.bbleague.se',
          },
          {
            externalId: 'id1',
            externalSystem: 'tloeg.bbleague.se',
          },
        ],
      });
      expect(result).toStrictEqual(['id1','id2']);
    });

    it('returns empty array if no external IDs are found', () => {
      const result = service.getExternalIds({});
      expect(result).toStrictEqual([]);
    });

    it('returns empty array if external IDs array is empty', () => {
      const result = service.getExternalIds({
        externalIds: [],
      });
      expect(result).toStrictEqual([]);
    });
  });

  describe('sameExternalId', () => {
    it('detects that two objects share one ID for correct system', () => {
      const result = service.sameExternalId(
        {
          externalIds: [
            {
              externalId: 'id1',
              externalSystem: 'tloeg.bbleague.se',
            },
            {
              externalId: 'id2',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
        {
          externalIds: [
            {
              externalId: 'id2',
              externalSystem: 'tloeg.bbleague.se',
            },
            {
              externalId: 'id3',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
      );
      expect(result).toBe(true);
    });

    it('ignores incorrect system', () => {
      const result = service.sameExternalId(
        {
          externalIds: [
            {
              externalId: 'id1',
              externalSystem: 'tloeg.bbleague.se',
            },
            {
              externalId: 'id2',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
        {
          externalIds: [
            {
              externalId: 'id2',
              externalSystem: 'wrongSystem',
            },
            {
              externalId: 'id3',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
      );
      expect(result).toBe(false);
    });

    it('handles first object having no external IDs', () => {
      const result = service.sameExternalId(
        {},
        {
          externalIds: [
            {
              externalId: 'id1',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
      );
      expect(result).toBe(false);
    });

    it('handles second object having no external IDs', () => {
      const result = service.sameExternalId(
        {
          externalIds: [
            {
              externalId: 'id1',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
        },
        {},
      );
      expect(result).toBe(false);
    });
  });
});
