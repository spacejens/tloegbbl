import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeInTeamTypeController } from './player-type-in-team-type.controller';
import { mock } from 'jest-mock-extended';
import { PlayerTypeInTeamTypeService } from '../persistence/player-type-in-team-type.service';
import { PlayerTypeInTeamTypeImportService } from '../import/player-type-in-team-type-import.service';

describe('PlayerTypeInTeamTypeController', () => {
  let controller: PlayerTypeInTeamTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerTypeInTeamTypeController],
      providers: [
        { provide: PlayerTypeInTeamTypeService, useValue: mock<PlayerTypeInTeamTypeService>() },
        { provide: PlayerTypeInTeamTypeImportService, useValue: mock<PlayerTypeInTeamTypeImportService>() },
      ],
    }).compile();

    controller = module.get<PlayerTypeInTeamTypeController>(PlayerTypeInTeamTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
