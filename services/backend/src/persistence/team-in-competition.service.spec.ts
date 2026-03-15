import { Test, TestingModule } from '@nestjs/testing';
import { TeamInCompetitionService } from './team-in-competition.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';

describe('TeamInCompetitionService', () => {
  let service: TeamInCompetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamInCompetitionService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
        { provide: CompetitionService, useValue: mock<CompetitionService>() },
      ],
    }).compile();

    service = module.get<TeamInCompetitionService>(TeamInCompetitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
