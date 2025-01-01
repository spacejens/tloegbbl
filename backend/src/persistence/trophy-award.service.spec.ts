import { Test, TestingModule } from '@nestjs/testing';
import { TrophyAwardService } from './trophy-award.service';
import { mock } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';
import { TrophyService } from './trophy.service';
import { CompetitionService } from './competition.service';
import { TeamService } from './team.service';
import { PlayerService } from './player.service';

describe('TrophyAwardService', () => {
  let service: TrophyAwardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrophyAwardService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: TrophyService, useValue: mock<TrophyService>() },
        { provide: CompetitionService, useValue: mock<CompetitionService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: PlayerService, useValue: mock<PlayerService>() },
      ],
    }).compile();

    service = module.get<TrophyAwardService>(TrophyAwardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
