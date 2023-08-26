import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { TeamService } from './team.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: TeamService, useValue: mock<TeamService>() },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
