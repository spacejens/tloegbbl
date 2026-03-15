import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeHasAdvancementService } from './player-type-has-advancement.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';
import { PlayerTypeService } from './player-type.service';
import { AdvancementService } from './advancement.service';

describe('PlayerTypeHasAdvancementService', () => {
  let service: PlayerTypeHasAdvancementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeHasAdvancementService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
        { provide: PlayerTypeService, useValue: mock<PlayerTypeService>() },
        { provide: AdvancementService, useValue: mock<AdvancementService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeHasAdvancementService>(
      PlayerTypeHasAdvancementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
