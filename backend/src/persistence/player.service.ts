import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { ExternalId, Player, PlayerReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { TeamService } from './team.service';
import { PlayerTypeService } from './player-type.service';

@Injectable()
export class PlayerService extends ExternallyIdentifiablePersistenceService<
  PlayerReference,
  Player
> {
  constructor(
    private prisma: PrismaService,
    private playerTypeService: PlayerTypeService,
    private teamService: TeamService,
  ) {
    super(prisma.player);
  }

  async findById(id: number): Promise<Player> {
    return await this.prisma.player.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      externalIds: true,
      playerType: {
        include: {
          externalIds: true,
        },
      },
      team: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByExternalId(externalId: ExternalId): Promise<Player> {
    return await this.prisma.player.findFirst({
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

  async create(input: Player): Promise<Player> {
    if (input.id) {
      throw new Error(
        `Attempting to create player with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const playerType = await this.playerTypeService.findByReference(
      input.playerType,
    );
    const team = await this.teamService.findByReference(input.team);
    return await this.prisma.player.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
        playerType: {
          connect: {
            id: playerType.id,
          },
        },
        team: {
          connect: {
            id: team.id,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Player): Promise<Player> {
    if (!input.id) {
      throw new Error(
        `Attempting up update player without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.player.update({
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
