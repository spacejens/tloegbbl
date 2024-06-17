import { Test, TestingModule } from '@nestjs/testing';
import { TeamInMatchController } from './team-in-match.controller';
import { mock } from 'jest-mock-extended';
import { TeamInMatchService } from '../persistence/team-in-match.service';
import { TeamInMatchImportService } from '../import/team-in-match-import.service';

describe('TeamInMatchController', () => {
  let controller: TeamInMatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamInMatchController],
      providers: [
        { provide: TeamInMatchService, useValue: mock<TeamInMatchService>() },
        { provide: TeamInMatchImportService, useValue: mock<TeamInMatchImportService>() },
      ],
    }).compile();

    controller = module.get<TeamInMatchController>(TeamInMatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
