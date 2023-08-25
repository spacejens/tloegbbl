import { Test, TestingModule } from '@nestjs/testing';
import { TeamInCompetitionImportService } from './team-in-competition-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { TeamInCompetitionService } from '../persistence/team-in-competition.service';

describe('TeamInCompetitionImportService', () => {
  let service: TeamInCompetitionImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamInCompetitionImportService,
        {
          provide: TeamInCompetitionService,
          useValue: mock<TeamInCompetitionService>(),
        },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TeamInCompetitionImportService>(
      TeamInCompetitionImportService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
