import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeHasAdvancementController } from './player-type-has-advancement.controller';
import { mock } from 'jest-mock-extended';
import { PlayerTypeHasAdvancementService } from '../persistence/player-type-has-advancement.service';
import { PlayerTypeHasAdvancementImportService } from '../import/player-type-has-advancement-import.service';

describe('PlayerTypeHasAdvancementController', () => {
  let controller: PlayerTypeHasAdvancementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerTypeHasAdvancementController],
      providers: [
        {
          provide: PlayerTypeHasAdvancementService,
          useValue: mock<PlayerTypeHasAdvancementService>(),
        },
        {
          provide: PlayerTypeHasAdvancementImportService,
          useValue: mock<PlayerTypeHasAdvancementImportService>(),
        },
      ],
    }).compile();

    controller = module.get<PlayerTypeHasAdvancementController>(
      PlayerTypeHasAdvancementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
