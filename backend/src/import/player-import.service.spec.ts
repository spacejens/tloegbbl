import { Test, TestingModule } from '@nestjs/testing';
import { PlayerImportService } from './player-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { PlayerService } from '../persistence/player.service';

describe('PlayerImportService', () => {
  let service: PlayerImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerImportService,
        { provide: PlayerService, useValue: mock<PlayerService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<PlayerImportService>(PlayerImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
