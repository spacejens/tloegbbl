import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Coach, CoachReference, ExternalId } from '../dtos';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';

@Injectable()
export class CoachService extends ExternallyIdentifiablePersistenceService<
  CoachReference,
  Coach
> {
  constructor(private prisma: PrismaService) {
    super(prisma.coach);
  }

  async findById(id: number): Promise<Coach> {
    return await this.prisma.coach.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async findByExternalId(externalId: ExternalId): Promise<Coach> {
    return await this.prisma.coach.findFirst({
      where: {
        externalIds: {
          some: {
            externalId: externalId.externalId,
            externalSystem: externalId.externalSystem,
          }
        }
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async create(input: Coach): Promise<Coach> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return await this.prisma.coach.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Coach): Promise<Coach> {
    // TODO Need to enforce that input has an ID, otherwise this might update all coaches?
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.coach.update({
      where: {
        id: input.id,
      },
      data: {
        externalIds: this.createAnonymousOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }
}
