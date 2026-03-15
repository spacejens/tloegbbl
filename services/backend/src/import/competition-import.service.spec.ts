import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionImportService } from './competition-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { CompetitionService } from '../persistence/competition.service';

describe('CompetitionImportService', () => {
  let service: CompetitionImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionImportService,
        { provide: CompetitionService, useValue: mock<CompetitionService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<CompetitionImportService>(CompetitionImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
