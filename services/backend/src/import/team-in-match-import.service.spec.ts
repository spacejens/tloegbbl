import { Test, TestingModule } from '@nestjs/testing';
import { TeamInMatchImportService } from './team-in-match-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { TeamInMatchService } from '../persistence/team-in-match.service';

describe('TeamInMatchImportService', () => {
  let service: TeamInMatchImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamInMatchImportService,
        { provide: TeamInMatchService, useValue: mock<TeamInMatchService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TeamInMatchImportService>(TeamInMatchImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
