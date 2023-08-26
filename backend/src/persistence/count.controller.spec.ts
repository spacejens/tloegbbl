import { Test, TestingModule } from '@nestjs/testing';
import { CountController } from './count.controller';
import { CoachService } from './coach.service';
import { mock } from 'jest-mock-extended';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';
import { TeamInCompetitionService } from './team-in-competition.service';
import { MatchService } from './match.service';
import { TeamInMatchService } from './team-in-match.service';
import { PlayerService } from './player.service';

describe('CountController', () => {
  let controller: CountController;
  let coachService: CoachService;
  let teamTypeService: TeamTypeService;
  let teamService: TeamService;
  let competitionService: CompetitionService;
  let teamInCompetitionService: TeamInCompetitionService;
  let matchService: MatchService;
  let teamInMatchService: TeamInMatchService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: CompetitionService, useValue: mock<CompetitionService>() },
        {
          provide: TeamInCompetitionService,
          useValue: mock<TeamInCompetitionService>(),
        },
        { provide: MatchService, useValue: mock<MatchService>() },
        { provide: TeamInMatchService, useValue: mock<TeamInMatchService>() },
        { provide: PlayerService, useValue: mock<PlayerService>() },
      ],
      controllers: [CountController],
    }).compile();

    controller = module.get<CountController>(CountController);
    coachService = module.get<CoachService>(CoachService);
    teamTypeService = module.get<TeamTypeService>(TeamTypeService);
    teamService = module.get<TeamService>(TeamService);
    competitionService = module.get<CompetitionService>(CompetitionService);
    teamInCompetitionService = module.get<TeamInCompetitionService>(
      TeamInCompetitionService,
    );
    matchService = module.get<MatchService>(MatchService);
    teamInMatchService = module.get<TeamInMatchService>(TeamInMatchService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('countEverything', () => {
    it('should count every type of data', async () => {
      coachService.count = jest.fn().mockReturnValue(111);
      teamTypeService.count = jest.fn().mockReturnValue(222);
      teamService.count = jest.fn().mockReturnValue(333);
      competitionService.count = jest.fn().mockReturnValue(444);
      teamInCompetitionService.count = jest.fn().mockReturnValue(555);
      matchService.count = jest.fn().mockReturnValue(666);
      teamInMatchService.count = jest.fn().mockReturnValue(777);
      playerService.count = jest.fn().mockReturnValue(888);
      const result = await controller.countEverything();
      expect(result).toStrictEqual({
        coaches: 111,
        teamTypes: 222,
        teams: 333,
        competitions: 444,
        teamsInCompetitions: 555,
        matches: 666,
        teamsInMatches: 777,
        players: 888,
      });
    });
  });
});
