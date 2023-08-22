import { Test, TestingModule } from '@nestjs/testing';
import { TeamImportService } from './team-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { TeamService } from '../persistence/team.service';

describe('TeamImportService', () => {
  let service: TeamImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamImportService,
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TeamImportService>(TeamImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
