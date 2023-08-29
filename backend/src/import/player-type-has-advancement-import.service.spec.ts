import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeHasAdvancementImportService } from './player-type-has-advancement-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { PlayerTypeHasAdvancementService } from '../persistence/player-type-has-advancement.service';

describe('PlayerTypeHasAdvancementImportService', () => {
  let service: PlayerTypeHasAdvancementImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeHasAdvancementImportService,
        {
          provide: PlayerTypeHasAdvancementService,
          useValue: mock<PlayerTypeHasAdvancementService>(),
        },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeHasAdvancementImportService>(
      PlayerTypeHasAdvancementImportService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
