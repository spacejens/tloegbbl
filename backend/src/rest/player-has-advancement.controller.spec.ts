import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHasAdvancementController } from './player-has-advancement.controller';
import { mock } from 'jest-mock-extended';
import { PlayerHasAdvancementService } from '../persistence/player-has-advancement.service';
import { PlayerHasAdvancementImportService } from '../import/player-has-advancement-import.service';

describe('PlayerHasAdvancementController', () => {
  let controller: PlayerHasAdvancementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerHasAdvancementController],
      providers: [
        { provide: PlayerHasAdvancementService, useValue: mock<PlayerHasAdvancementService>() },
        { provide: PlayerHasAdvancementImportService, useValue: mock<PlayerHasAdvancementImportService>() },
      ],
    }).compile();

    controller = module.get<PlayerHasAdvancementController>(PlayerHasAdvancementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
