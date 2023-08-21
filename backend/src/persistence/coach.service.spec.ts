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
    beforeEach(() => {
      prismaService.coach.create = jest.fn().mockImplementation((input: { data: any }) => ({
        id: 99,
        externalId: input.data.externalId.createMany.data ? input.data.externalId.createMany.data.map((extId) => ({
          id: 66,
          externalId: extId.externalId,
          externalSystem: extId.externalSystem,
        })) : [],
        name: input.data.name,
      }));
    });

    it('should create record with no externalIds', async () => {
      const result = await service.createCoach({
        externalIds: [],
        name: 'New',
      });
      expect(result).toEqual({
        id: 99,
        externalIds: [],
        name: 'New',
      });
    });

    // TODO Add test case for creating coach with undefined externalIds property

    it('should create record with externalIds', async () => {
      const result = await service.createCoach({
        externalIds: [{ externalId: "ExtId", externalSystem: "ExtSys" }],
        name: 'New with ExtIds',
      });
      expect(result).toEqual({
        id: 99,
        externalIds: [{ id: 66, externalId: "ExtId", externalSystem: "ExtSys" }],
        name: 'New with ExtIds',
      });
    });
  });

  describe('updateCoach', () => {
    // TODO Implement test cases
  });
});
