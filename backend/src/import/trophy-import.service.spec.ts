import { Test, TestingModule } from '@nestjs/testing';
import { TrophyImportService } from './trophy-import.service';
import { mock } from 'jest-mock-extended';
import { CombineDataService } from './combine-data.service';
import { TrophyService } from '../persistence/trophy.service';

describe('TrophyImportService', () => {
  let service: TrophyImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrophyImportService,
        { provide: TrophyService, useValue: mock<TrophyService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TrophyImportService>(TrophyImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
