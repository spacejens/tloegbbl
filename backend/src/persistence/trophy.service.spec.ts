import { Test, TestingModule } from '@nestjs/testing';
import { TrophyService } from './trophy.service';
import { mock } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';

describe('TrophyService', () => {
  let service: TrophyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrophyService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<TrophyService>(TrophyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
