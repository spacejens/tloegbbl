import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { mock } from 'jest-mock-extended';
import { TeamService } from '../persistence/team.service';
import { TeamImportService } from '../import/team-import.service';

describe('TeamController', () => {
  let controller: TeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: TeamImportService, useValue: mock<TeamImportService>() },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
