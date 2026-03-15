import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypeService } from './team-type.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('TeamTypeService', () => {
  let service: TeamTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamTypeService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<TeamTypeService>(TeamTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
