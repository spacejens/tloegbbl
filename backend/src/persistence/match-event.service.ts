import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import {
  ExternalId,
  MatchEvent,
  MatchEventActionType,
  MatchEventConsequenceType,
  MatchEventReference,
} from '../dtos';
import { PrismaService } from './prisma.service';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { TeamService } from './team.service';
import { Prisma, $Enums } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class MatchEventService extends ExternallyIdentifiablePersistenceService<
  MatchEventReference,
  MatchEvent
> {
  constructor(
    private prisma: PrismaService,
    private matchService: MatchService,
    private teamService: TeamService,
    private playerService: PlayerService,
  ) {
    super(prisma.matchEvent);
  }

  async findById(id: number): Promise<MatchEvent> {
    return await this.wrap(
      this.prisma.matchEvent.findUnique({
        where: {
          id: id,
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  fieldsNeededForTheDto() {
    return {
      externalIds: true,
      match: {
        include: {
          externalIds: true,
        },
      },
      actingTeam: {
        include: {
          externalIds: true,
        },
      },
      actingPlayer: {
        include: {
          externalIds: true,
        },
      },
      consequenceTeam: {
        include: {
          externalIds: true,
        },
      },
      consequencePlayer: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByExternalId(externalId: ExternalId): Promise<MatchEvent> {
    return await this.wrap(
      this.prisma.matchEvent.findFirst({
        where: {
          externalIds: {
            some: {
              externalId: externalId.externalId,
              externalSystem: externalId.externalSystem,
            },
          },
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  async create(input: MatchEvent): Promise<MatchEvent> {
    if (input.id) {
      throw new Error(
        `Attempting to create match event with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const match = await this.matchService.findByReference(input.match);
    const actingTeam = input.actingTeam
      ? await this.teamService.findByReference(input.actingTeam)
      : undefined;
    const actingPlayer = input.actingPlayer
      ? await this.playerService.findByReference(input.actingPlayer)
      : undefined;
    const consequenceTeam = input.consequenceTeam
      ? await this.teamService.findByReference(input.consequenceTeam)
      : undefined;
    const consequencePlayer = input.consequencePlayer
      ? await this.playerService.findByReference(input.consequencePlayer)
      : undefined;
    return await this.wrap(
      this.prisma.matchEvent.create({
        data: {
          externalIds: this.createAllOf(input.externalIds),
          actionType: input.actionType,
          consequenceType: input.consequenceType,
          match: {
            connect: {
              id: match.id,
            },
          },
          actingTeam: actingTeam
            ? {
                connect: {
                  id: actingTeam.id,
                },
              }
            : undefined,
          actingPlayer: actingPlayer
            ? {
                connect: {
                  id: actingPlayer.id,
                },
              }
            : undefined,
          consequenceTeam: consequenceTeam
            ? {
                connect: {
                  id: consequenceTeam.id,
                },
              }
            : undefined,
          consequencePlayer: consequencePlayer
            ? {
                connect: {
                  id: consequencePlayer.id,
                },
              }
            : undefined,
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  async update(input: MatchEvent): Promise<MatchEvent> {
    if (!input.id) {
      throw new Error(
        `Attempting up update match event without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.wrap(
      this.prisma.matchEvent.update({
        where: {
          id: input.id,
        },
        data: {
          externalIds: this.createAnonymousOf(input.externalIds),
          actionType: input.actionType,
          consequenceType: input.consequenceType,
          // TODO Support changing/adding acting/consequence team for match event?
          // TODO Support changing/adding acting/consequence player for match event?
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  // TODO Possible to avoid huge type declaration here? Use any? Or some Prisma generated type?
  private async wrap(
    input: Prisma.Prisma__MatchEventClient<
      {
        externalIds: {
          id: number;
          externalId: string;
          externalSystem: string;
          matchEventId: number;
        }[];
        match: {
          externalIds: {
            id: number;
            externalId: string;
            externalSystem: string;
            matchId: number;
          }[];
        } & { id: number; name: string; competitionId: number };
        actingTeam: {
          externalIds: {
            id: number;
            externalId: string;
            externalSystem: string;
            teamId: number;
          }[];
        } & {
          id: number;
          name: string;
          headCoachId: number;
          coCoachId: number;
          teamTypeId: number;
        };
        actingPlayer: {
          externalIds: {
            id: number;
            externalId: string;
            externalSystem: string;
            playerId: number;
          }[];
        } & { id: number; name: string; playerTypeId: number; teamId: number };
        consequenceTeam: {
          externalIds: {
            id: number;
            externalId: string;
            externalSystem: string;
            teamId: number;
          }[];
        } & {
          id: number;
          name: string;
          headCoachId: number;
          coCoachId: number;
          teamTypeId: number;
        };
        consequencePlayer: {
          externalIds: {
            id: number;
            externalId: string;
            externalSystem: string;
            playerId: number;
          }[];
        } & { id: number; name: string; playerTypeId: number; teamId: number };
      } & {
        id: number;
        matchId: number;
        actingTeamId: number;
        actingPlayerId: number;
        actionType: $Enums.MatchEventActionType;
        consequenceTeamId: number;
        consequencePlayerId: number;
        consequenceType: $Enums.MatchEventConsequenceType;
      },
      null,
      DefaultArgs
    >,
  ): Promise<MatchEvent> {
    const entity = await input;
    return (
      entity && {
        id: entity.id,
        externalIds: entity.externalIds,
        match: entity.match,
        actingTeam: entity.actingTeam,
        actingPlayer: entity.actingPlayer,
        actionType: MatchEventActionType[entity.actionType],
        consequenceTeam: entity.consequenceTeam,
        consequencePlayer: entity.consequencePlayer,
        consequenceType: MatchEventConsequenceType[entity.consequenceType],
      }
    );
  }
}
