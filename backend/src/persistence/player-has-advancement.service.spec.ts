import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHasAdvancementService } from './player-has-advancement.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { PlayerService } from './player.service';
import { AdvancementService } from './advancement.service';

describe('PlayerHasAdvancementService', () => {
  let service: PlayerHasAdvancementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerHasAdvancementService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: PlayerService, useValue: mock<PlayerService>() },
        { provide: AdvancementService, useValue: mock<AdvancementService>() },
      ],
    }).compile();

    service = module.get<PlayerHasAdvancementService>(
      PlayerHasAdvancementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
