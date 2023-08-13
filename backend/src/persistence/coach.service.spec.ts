import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from './coach.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('CoachService', () => {
  let service: CoachService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});