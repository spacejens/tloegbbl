import { Test, TestingModule } from '@nestjs/testing';
import { TrophyAwardImportService } from './trophy-award-import.service';
import { mock } from 'jest-mock-extended';
import { TrophyAwardService } from '../persistence/trophy-award.service';
import { CombineDataService } from './combine-data.service';

describe('TrophyAwardImportService', () => {
  let service: TrophyAwardImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrophyAwardImportService,
        { provide: TrophyAwardService, useValue: mock<TrophyAwardService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<TrophyAwardImportService>(TrophyAwardImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
