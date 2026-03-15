import { Test, TestingModule } from '@nestjs/testing';
import { AdvancementService } from './advancement.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('AdvancementService', () => {
  let service: AdvancementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancementService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<AdvancementService>(AdvancementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
