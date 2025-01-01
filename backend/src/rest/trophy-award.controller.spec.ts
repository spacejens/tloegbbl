import { Test, TestingModule } from '@nestjs/testing';
import { TrophyAwardController } from './trophy-award.controller';
import { mock } from 'jest-mock-extended';
import { TrophyAwardService } from '../persistence/trophy-award.service';
import { TrophyAwardImportService } from '../import/trophy-award-import.service';

describe('TrophyAwardController', () => {
  let controller: TrophyAwardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrophyAwardController],
      providers: [
        {
          provide: TrophyAwardService,
          useValue: mock<TrophyAwardService>(),
        },
        {
          provide: TrophyAwardImportService,
          useValue: mock<TrophyAwardImportService>(),
        },
      ],
    }).compile();

    controller = module.get<TrophyAwardController>(TrophyAwardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
