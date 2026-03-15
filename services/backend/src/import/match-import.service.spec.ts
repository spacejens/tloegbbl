import { Test, TestingModule } from '@nestjs/testing';
import { MatchImportService } from './match-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { MatchService } from '../persistence/match.service';

describe('MatchImportService', () => {
  let service: MatchImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchImportService,
        { provide: MatchService, useValue: mock<MatchService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<MatchImportService>(MatchImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
