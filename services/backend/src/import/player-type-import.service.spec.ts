import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeImportService } from './player-type-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { PlayerTypeService } from '../persistence/player-type.service';

describe('PlayerTypeImportService', () => {
  let service: PlayerTypeImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeImportService,
        { provide: PlayerTypeService, useValue: mock<PlayerTypeService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeImportService>(PlayerTypeImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
