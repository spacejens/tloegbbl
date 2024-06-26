import { Test, TestingModule } from '@nestjs/testing';
import { CoachImportService } from './coach-import.service';
import { CoachService } from '../persistence/coach.service';
import { mock } from 'jest-mock-extended';
import { CombineDataService } from './combine-data.service';

describe('CoachImportService', () => {
  let service: CoachImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachImportService,
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<CoachImportService>(CoachImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
