import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { TrophyAward, TrophyAwardReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { TrophyService } from './trophy.service';
import { CompetitionService } from './competition.service';
import { TeamService } from './team.service';
import { PlayerService } from './player.service';

@Injectable()
export class TrophyAwardService extends IdentifiablePersistenceService<
  TrophyAwardReference,
  TrophyAward
> {
  constructor(
    private prisma: PrismaService,
    private trophyService: TrophyService,
    private competitionService: CompetitionService,
    private teamService: TeamService,
    private playerService: PlayerService,
  ) {
    super(prisma.trophyAward);
  }

  async findById(id: number): Promise<TrophyAward> {
    return await this.prisma.trophyAward.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      trophy: {
        include: {
          externalIds: true,
        },
      },
      competition: {
        include: {
          externalIds: true,
        },
      },
      team: {
        include: {
          externalIds: true,
        },
      },
      player: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByReference(reference: TrophyAwardReference): Promise<TrophyAward> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const trophy = await this.trophyService.findByReference(reference.trophy);
      const competition = await this.competitionService.findByReference(
        reference.competition,
      );
      const team = await this.teamService.findByReference(reference.team);
      const player = reference.player
        ? await this.playerService.findByReference(reference.player)
        : undefined;
      if (trophy && competition && team) {
        const results = await this.prisma.trophyAward.findMany({
          where: {
            trophy: {
              id: trophy.id,
            },
            competition: {
              id: competition.id,
            },
            team: {
              id: team.id,
            },
            player: player
              ? {
                  id: player.id,
                }
              : {
                  is: null,
                },
          },
          include: this.fieldsNeededForTheDto(),
        });
        if (results.length == 1) {
          return results[0];
        } else if (results.length > 1) {
          throw new Error(
            `Found ${results.length} records for trophy award ${trophy.id} in competition ${competition.id} for team ${team.id} and player ${player?.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(input: TrophyAward): Promise<TrophyAward> {
    if (input.id) {
      throw new Error(
        `Attempting to create trophy award with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const trophy = await this.trophyService.findByReference(input.trophy);
    if (!trophy) {
      throw new Error(`Failed to find trophy: ${JSON.stringify(input.trophy)}`);
    }
    const competition = await this.competitionService.findByReference(
      input.competition,
    );
    if (!competition) {
      throw new Error(
        `Failed to find competition: ${JSON.stringify(input.competition)}`,
      );
    }
    const team = await this.teamService.findByReference(input.team);
    if (!team) {
      throw new Error(`Failed to find team: ${JSON.stringify(input.team)}`);
    }
    const player = input.player
      ? await this.playerService.findByReference(input.player)
      : undefined;
    if (input.player && !player) {
      throw new Error(`Failed to find player: ${JSON.stringify(input.player)}`);
    }
    return await this.prisma.trophyAward.create({
      data: {
        trophy: {
          connect: {
            id: trophy.id,
          },
        },
        competition: {
          connect: {
            id: competition.id,
          },
        },
        team: {
          connect: {
            id: team.id,
          },
        },
        player: player
          ? {
              connect: {
                id: player.id,
              },
            }
          : undefined,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: TrophyAward): Promise<TrophyAward> {
    if (!input.id) {
      throw new Error(
        `Attempting up update trophy award without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    return await this.prisma.trophyAward.update({
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
