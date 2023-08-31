import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { PlayerTypeInTeamType, PlayerTypeInTeamTypeReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { PlayerTypeService } from './player-type.service';
import { TeamTypeService } from './team-type.service';

@Injectable()
export class PlayerTypeInTeamTypeService extends IdentifiablePersistenceService<
  PlayerTypeInTeamTypeReference,
  PlayerTypeInTeamType
> {
  constructor(
    private prisma: PrismaService,
    private playerTypeService: PlayerTypeService,
    private teamTypeService: TeamTypeService,
  ) {
    super(prisma.playerTypeInTeamType);
  }

  async findById(id: number): Promise<PlayerTypeInTeamType> {
    return await this.prisma.playerTypeInTeamType.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      playerType: {
        include: {
          externalIds: true,
        },
      },
      teamType: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByReference(
    reference: PlayerTypeInTeamTypeReference,
  ): Promise<PlayerTypeInTeamType> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const playerType = await this.playerTypeService.findByReference(
        reference.playerType,
      );
      const teamType = await this.teamTypeService.findByReference(
        reference.teamType,
      );
      if (playerType && teamType) {
        const results = await this.prisma.playerTypeInTeamType.findMany({
          where: {
            playerType: {
              id: playerType.id,
            },
            teamType: {
              id: teamType.id,
            },
          },
          include: this.fieldsNeededForTheDto(),
        });
        if (results.length == 1) {
          return results[0];
        } else if (results.length > 1) {
          throw new Error(
            `Found ${results.length} records for player type ${playerType.id} in team type ${teamType.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(input: PlayerTypeInTeamType): Promise<PlayerTypeInTeamType> {
    if (input.id) {
      throw new Error(
        `Attempting to create player type in team type with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const playerType = await this.playerTypeService.findByReference(
      input.playerType,
    );
    if (!playerType) {
      throw new Error(
        `Failed to find player type: ${JSON.stringify(input.playerType)}`,
      );
    }
    const teamType = await this.teamTypeService.findByReference(input.teamType);
    if (!teamType) {
      throw new Error(
        `Failed to find team type: ${JSON.stringify(input.teamType)}`,
      );
    }
    return await this.prisma.playerTypeInTeamType.create({
      data: {
        playerType: {
          connect: {
            id: playerType.id,
          },
        },
        teamType: {
          connect: {
            id: teamType.id,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: PlayerTypeInTeamType): Promise<PlayerTypeInTeamType> {
    if (!input.id) {
      throw new Error(
        `Attempting up update player type in team type without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    return await this.prisma.playerTypeInTeamType.update({
      where: {
        id: input.id,
      },
      data: {
        // TODO Actually update some fields when there are fields that can be updated
      },
      include: this.fieldsNeededForTheDto(),
    });
  }
}
