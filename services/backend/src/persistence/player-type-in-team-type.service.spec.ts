import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeInTeamTypeService } from './player-type-in-team-type.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { PlayerTypeService } from './player-type.service';
import { TeamTypeService } from './team-type.service';

describe('PlayerTypeInTeamTypeService', () => {
  let service: PlayerTypeInTeamTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeInTeamTypeService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: PlayerTypeService, useValue: mock<PlayerTypeService>() },
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeInTeamTypeService>(
      PlayerTypeInTeamTypeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
