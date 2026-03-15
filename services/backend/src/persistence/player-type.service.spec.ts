import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypeService } from './player-type.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('PlayerTypeService', () => {
  let service: PlayerTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypeService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<PlayerTypeService>(PlayerTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
