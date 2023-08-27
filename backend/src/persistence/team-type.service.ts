import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, TeamType, TeamTypeReference } from '../dtos';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';

@Injectable()
export class TeamTypeService extends ExternallyIdentifiablePersistenceService<
  TeamTypeReference,
  TeamType
> {
  constructor(private prisma: PrismaService) {
    super(prisma.teamType);
  }

  async findById(id: number): Promise<TeamType> {
    return await this.prisma.teamType.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async findByExternalId(externalId: ExternalId): Promise<TeamType> {
    return await this.prisma.teamType.findFirst({
      where: {
        externalIds: {
          some: {
            externalId: externalId.externalId,
            externalSystem: externalId.externalSystem,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async create(input: TeamType): Promise<TeamType> {
    if (input.id) {
      throw new Error(
        `Attempting to create team type with existing ID ${input.id}`,
      );
    }
    return await this.prisma.teamType.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: TeamType): Promise<TeamType> {
    if (!input.id) {
      throw new Error(
        `Attempting up update team type without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.teamType.update({
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
