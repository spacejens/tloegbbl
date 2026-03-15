import { Test, TestingModule } from '@nestjs/testing';
import { TeamInMatchService } from './team-in-match.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { TeamService } from './team.service';
import { MatchService } from './match.service';

describe('TeamInMatchService', () => {
  let service: TeamInMatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamInMatchService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: MatchService, useValue: mock<MatchService>() },
      ],
    }).compile();

    service = module.get<TeamInMatchService>(TeamInMatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
