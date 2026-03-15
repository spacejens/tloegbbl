import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventService } from './match-event.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { TeamService } from './team.service';

describe('MatchEventService', () => {
  let service: MatchEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchEventService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: MatchService, useValue: mock<MatchService>() },
        { provide: PlayerService, useValue: mock<PlayerService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
      ],
    }).compile();

    service = module.get<MatchEventService>(MatchEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
