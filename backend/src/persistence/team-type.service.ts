import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, TeamType, TeamTypeReference } from '../dtos';
import { PersistenceService } from './persistence.service';

@Injectable()
export class TeamTypeService extends PersistenceService<
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
    // TODO Refactor this to a single Prisma query instead of having to get team type by ID after finding externalId
    const found = await this.prisma.externalTeamTypeId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.teamTypeId);
    }
    return undefined;
  }

  async create(input: TeamType): Promise<TeamType> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return await this.prisma.teamType.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: TeamType): Promise<TeamType> {
    // TODO Need to enforce that input has an ID, otherwise this might update all team types?
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
