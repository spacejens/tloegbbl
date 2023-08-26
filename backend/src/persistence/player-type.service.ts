import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, PlayerType, PlayerTypeReference } from '../dtos';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';

@Injectable()
export class PlayerTypeService extends ExternallyIdentifiablePersistenceService<
  PlayerTypeReference,
  PlayerType
> {
  constructor(private prisma: PrismaService) {
    super(prisma.playerType);
  }

  async findById(id: number): Promise<PlayerType> {
    return await this.prisma.playerType.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async findByExternalId(externalId: ExternalId): Promise<PlayerType> {
    // TODO Refactor this to a single Prisma query instead of having to get by ID after finding externalId
    const found = await this.prisma.externalPlayerTypeId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.playerTypeId);
    }
    return undefined;
  }

  async create(input: PlayerType): Promise<PlayerType> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return await this.prisma.playerType.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: PlayerType): Promise<PlayerType> {
    // TODO Need to enforce that input has an ID, otherwise this might update all?
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.playerType.update({
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
