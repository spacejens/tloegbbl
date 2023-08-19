import { Test, TestingModule } from '@nestjs/testing';
import { CoachImportService } from './coach-import.service';
import { CoachService } from '../persistence/coach.service';
import { mock } from 'jest-mock-extended';
import { ImportResponseStatus } from './envelopes';
import { Coach } from 'src/dtos';
import { CombineDataService } from './combine-data.service';

describe('CoachImportService', () => {
  let service: CoachImportService;
  let coachService: CoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachImportService,
        { provide: CoachService, useValue: mock<CoachService>() },
        CombineDataService,
      ],
    }).compile();

    service = module.get<CoachImportService>(CoachImportService);
    coachService = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importCoach', () => {
    it('should create a new instance if not found', async () => {
      coachService.createCoach = jest.fn().mockImplementation(
        (input: Coach): Coach => ({
          id: 47,
          externalIds: input.externalIds,
          name: input.name,
        }),
      );
      const result = await service.importCoach({
        data: {
          externalIds: [
            {
              externalSystem: 'UnitTests',
              externalId: 'New',
            },
          ],
          name: 'New Coach',
        },
      });
      // TODO The level of mock implementation and comparisons are overkill, a lot is just testing the mocked implementation
      expect(result).toStrictEqual({
        status: ImportResponseStatus.Inserted,
        data: {
          id: 47,
          externalIds: [
            {
              externalSystem: 'UnitTests',
              externalId: 'New',
            },
          ],
          name: 'New Coach',
        },
      });
      expect(coachService.createCoach).toHaveBeenCalledWith({
        externalIds: [
          {
            externalSystem: 'UnitTests',
            externalId: 'New',
          },
        ],
        name: 'New Coach',
      });
    });

    // TODO Test cases for updating (including checking externalIds combination)
  });
});
