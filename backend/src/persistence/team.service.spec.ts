import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { CoachService } from './coach.service';
import { TeamTypeService } from './team-type.service';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
