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

  describe('findCoachByExternalId', () => {
    it('should return found coach', async () => {
      prismaService.externalCoachId.findUnique = jest.fn().mockReturnValue({
        id: 11,
        externalId: 'ExtId',
        externalSystem: 'ExtSys',
        coachId: 23,
      });
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
      const result = await service.findCoachByExternalId({
        externalId: 'ExtId',
        externalSystem: 'ExtSys',
      });
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
      expect(prismaService.externalCoachId.findUnique).toHaveBeenCalledWith({
        where: {
          externalId_externalSystem: {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        },
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
      prismaService.externalCoachId.findUnique = jest
        .fn()
        .mockReturnValue(undefined);
      prismaService.coach.findUnique = jest.fn();
      const result = await service.findCoachByExternalId({
        externalId: 'ExtId',
        externalSystem: 'ExtSys',
      });
      expect(result).toEqual(undefined);
      expect(prismaService.externalCoachId.findUnique).toHaveBeenCalledWith({
        where: {
          externalId_externalSystem: {
            externalId: 'ExtId',
            externalSystem: 'ExtSys',
          },
        },
      });
      expect(prismaService.coach.findUnique).toHaveBeenCalledTimes(0);
    });
  });

  describe('findCoachByReference', () => {
    // TODO Implement test cases
  });

  describe('createCoach', () => {
    // TODO Implement test cases
  });

  describe('updateCoach', () => {
    // TODO Implement test cases
  });
});
