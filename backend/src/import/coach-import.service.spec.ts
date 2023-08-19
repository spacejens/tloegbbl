import { Test, TestingModule } from '@nestjs/testing';
import { CoachImportService } from './coach-import.service';
import { CoachService } from '../persistence/coach.service';
import { mock } from 'jest-mock-extended';
import { ImportResponseStatus } from './envelopes';
import { Coach, CoachReference } from '../dtos';
import { CombineDataService } from './combine-data.service';

describe('CoachImportService', () => {
  let service: CoachImportService;
  let coachService: CoachService;
  let combineDataService: CombineDataService;

  const mockFindCoachByReference = (id: number, name: string) => {
    return jest.fn().mockImplementation((input: CoachReference) => ({
      id: id,
      name: name,
    }));
  };

  const mockCreateCoach = (id: number) => {
    return jest.fn().mockImplementation(
      (input: Coach): Coach => ({
        ...input,
        id: id,
      }),
    );
  };

  const mockUpdateCoach = (nameSuffix: string) => {
    return jest.fn().mockImplementation(
      (input: Coach): Coach => ({
        ...input,
        name: input.name + nameSuffix,
      }),
    );
  };

  const mockPreferFound = () => {
    return jest.fn().mockImplementation(
      (requested: Coach, found: Coach): Coach => ({
        ...requested,
        ...found,
        name: requested.name + ' ' + found.name,
      }),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachImportService,
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<CoachImportService>(CoachImportService);
    coachService = module.get<CoachService>(CoachService);
    combineDataService = module.get<CombineDataService>(CombineDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importCoach', () => {
    it('should create a new instance if not found', async () => {
      coachService.createCoach = mockCreateCoach(47);
      const result = await service.importCoach({
        data: {
          name: 'New Coach',
        },
      });
      expect(result).toStrictEqual({
        status: ImportResponseStatus.Inserted,
        data: {
          id: 47,
          name: 'New Coach',
        },
      });
    });

    // TODO Both test cases should verify what the other service methods were called with

    it('should update existing instance if found', async () => {
      coachService.findCoachByReference = mockFindCoachByReference(31, 'Found');
      combineDataService.preferFound = mockPreferFound();
      coachService.updateCoach = mockUpdateCoach(' Updated');
      const result = await service.importCoach({
        data: {
          name: 'Requested',
        },
      });
      expect(result).toStrictEqual({
        status: ImportResponseStatus.Updated,
        data: {
          id: 31,
          name: 'Requested Found Updated',
        },
      });
    });
  });
});
