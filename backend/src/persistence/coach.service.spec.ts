import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from './coach.service';
import { PrismaService } from './prisma.service';
import { mock } from 'jest-mock-extended';

describe('CoachService', () => {
  let service: CoachService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachService,
        { provide: PrismaService, useValue: mock<PrismaService>() },
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('countCoaches', () => {
    it('should return the count', async () => {
      prismaService.coach.count = jest.fn().mockReturnValue(23);
      const result = await service.countCoaches();
      expect(result).toBe(23);
    });
  });

  describe('findCoachById', () => {
    it('should return found coach without external IDs', async () => {
      prismaService.coach.findUnique = jest.fn().mockReturnValue({
        id: 23,
        externalId: [],
        name: 'Found',
      });
      const result = await service.findCoachById(23);
      expect(result).toEqual({
        id: 23,
        externalIds: [],
        name: 'Found',
      });
      expect(prismaService.coach.findUnique).toHaveBeenCalledWith({
        where: {
          id: 23,
        },
        include: {
          externalId: true,
        },
      });
    });

    it('should return found coach with external IDs', async () => {
      prismaService.coach.findUnique = jest.fn().mockReturnValue({
        id: 23,
        externalId: [
          {
            id: 45,
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
        name: 'Found',
      });
      const result = await service.findCoachById(23);
      expect(result).toEqual({
        id: 23,
        externalIds: [
          {
            id: 45,
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        ],
        name: 'Found',
      });
      expect(prismaService.coach.findUnique).toHaveBeenCalledWith({
        where: {
          id: 23,
        },
        include: {
          externalId: true,
        },
      });
    });

    it('should return undefined if not found', async () => {
      prismaService.coach.findUnique = jest.fn().mockReturnValue(undefined);
      const result = await service.findCoachById(23);
      expect(result).toEqual(undefined);
      expect(prismaService.coach.findUnique).toHaveBeenCalledWith({
        where: {
          id: 23,
        },
        include: {
          externalId: true,
        },
      });
    });
  });

  // TODO Unit test the rest of the methods
});
