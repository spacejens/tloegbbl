import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHasAdvancementImportService } from './player-has-advancement-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { PlayerHasAdvancementService } from '../persistence/player-has-advancement.service';

describe('PlayerHasAdvancementImportService', () => {
  let service: PlayerHasAdvancementImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerHasAdvancementImportService,
        {
          provide: PlayerHasAdvancementService,
          useValue: mock<PlayerHasAdvancementService>(),
        },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<PlayerHasAdvancementImportService>(
      PlayerHasAdvancementImportService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
