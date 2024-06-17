import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { mock } from 'jest-mock-extended';
import { PlayerService } from '../persistence/player.service';
import { PlayerImportService } from '../import/player-import.service';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        { provide: PlayerService, useValue: mock<PlayerService>() },
        { provide: PlayerImportService, useValue: mock<PlayerImportService>() },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
