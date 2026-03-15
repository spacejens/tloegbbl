import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionService } from './competition.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('CompetitionService', () => {
  let service: CompetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<CompetitionService>(CompetitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
