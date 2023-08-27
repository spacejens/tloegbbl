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
    return await this.prisma.playerType.findFirst({
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

  async create(input: PlayerType): Promise<PlayerType> {
    if (input.id) {
      throw new Error(
        `Attempting to create player type with existing ID ${input.id}`,
      );
    }
    return await this.prisma.playerType.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: PlayerType): Promise<PlayerType> {
    if (!input.id) {
      throw new Error(
        `Attempting up update player type without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
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
