import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeInTeamTypeImportService } from './player-type-in-team-type-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { PlayerTypeInTeamTypeService } from '../persistence/player-type-in-team-type.service';

describe('PlayerTypeInTeamTypeImportService', () => {
  let service: PlayerTypeInTeamTypeImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeInTeamTypeImportService,
        {
          provide: PlayerTypeInTeamTypeService,
          useValue: mock<PlayerTypeInTeamTypeService>(),
        },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeInTeamTypeImportService>(
      PlayerTypeInTeamTypeImportService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
