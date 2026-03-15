import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypeImportService } from './team-type-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { TeamTypeService } from '../persistence/team-type.service';

describe('TeamTypeImportService', () => {
  let service: TeamTypeImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamTypeImportService,
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TeamTypeImportService>(TeamTypeImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
