import { Test, TestingModule } from '@nestjs/testing';
import { CountController } from './count.controller';
import { CoachService } from './coach.service';
import { mock } from 'jest-mock-extended';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';

describe('CountController', () => {
  let controller: CountController;
  let coachService: CoachService;
  let teamTypeService: TeamTypeService;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
      ],
      controllers: [CountController],
    }).compile();

    controller = module.get<CountController>(CountController);
    coachService = module.get<CoachService>(CoachService);
    teamTypeService = module.get<TeamTypeService>(TeamTypeService);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('countEverything', () => {
    it('should count every type of data', async () => {
      coachService.count = jest.fn().mockReturnValue(111);
      teamTypeService.count = jest.fn().mockReturnValue(222);
      teamService.count = jest.fn().mockReturnValue(333);
      const result = await controller.countEverything();
      expect(result).toStrictEqual({
        coaches: 111,
        teamTypes: 222,
        teams: 333,
      });
    });
  });
});
