import { Test, TestingModule } from '@nestjs/testing';
import { TeamInCompetitionController } from './team-in-competition.controller';
import { mock } from 'jest-mock-extended';
import { TeamInCompetitionService } from '../persistence/team-in-competition.service';
import { TeamInCompetitionImportService } from '../import/team-in-competition-import.service';

describe('TeamInCompetitionController', () => {
  let controller: TeamInCompetitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamInCompetitionController],
      providers: [
        { provide: TeamInCompetitionService, useValue: mock<TeamInCompetitionService>() },
        { provide: TeamInCompetitionImportService, useValue: mock<TeamInCompetitionImportService>() },
      ],
    }).compile();

    controller = module.get<TeamInCompetitionController>(TeamInCompetitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
