import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeController } from './player-type.controller';
import { mock } from 'jest-mock-extended';
import { PlayerTypeService } from '../persistence/player-type.service';
import { PlayerTypeImportService } from '../import/player-type-import.service';

describe('PlayerTypeController', () => {
  let controller: PlayerTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerTypeController],
      providers: [
        { provide: PlayerTypeService, useValue: mock<PlayerTypeService>() },
        { provide: PlayerTypeImportService, useValue: mock<PlayerTypeImportService>() },
      ],
    }).compile();

    controller = module.get<PlayerTypeController>(PlayerTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
