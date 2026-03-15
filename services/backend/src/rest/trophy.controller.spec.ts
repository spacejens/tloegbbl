import { Test, TestingModule } from '@nestjs/testing';
import { TrophyController } from './trophy.controller';
import { mock } from 'jest-mock-extended';
import { TrophyService } from '../persistence/trophy.service';
import { TrophyImportService } from '../import/trophy-import.service';

describe('TrophyController', () => {
  let controller: TrophyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrophyController],
      providers: [
        { provide: TrophyService, useValue: mock<TrophyService>() },
        { provide: TrophyImportService, useValue: mock<TrophyImportService>() },
      ],
    }).compile();

    controller = module.get<TrophyController>(TrophyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
