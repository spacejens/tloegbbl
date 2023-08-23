import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, Team, TeamReference } from '../dtos';
import { TeamTypeService } from './team-type.service';
import { CoachService } from './coach.service';
import { PersistenceService } from './persistence.service';

@Injectable()
export class TeamService extends PersistenceService<TeamReference, Team> {
  constructor(
    private prisma: PrismaService,
    private coachService: CoachService,
    private teamTypeService: TeamTypeService,
  ) {
    super();
  }

  async findById(id: number): Promise<Team> {
    return this.wrap(
      await this.prisma.team.findUnique({
        where: {
          id: id,
        },
        include: {
          externalId: true,
          headCoach: {
            include: {
              externalId: true,
            },
          },
          coCoach: {
            include: {
              externalId: true,
            },
          },
          teamType: {
            include: {
              externalId: true,
            },
          },
        },
      }),
    );
  }

  // TODO Signature of wrap method should ideally use a Prisma type as argument
  private wrap(found: {
    id: number;
    externalId: {
      id: number;
      externalId: string;
      externalSystem: string;
    }[];
    name: string;
    headCoach: {
      id: number;
      externalId: {
        id: number;
        externalId: string;
        externalSystem: string;
      }[];
    };
    coCoach?: {
      id: number;
      externalId: {
        id: number;
        externalId: string;
        externalSystem: string;
      }[];
    };
    teamType: {
      id: number;
      externalId: {
        id: number;
        externalId: string;
        externalSystem: string;
      }[];
    };
  }): Team {
    return (
      found && {
        id: found.id,
        externalIds: found.externalId.map((extId) => ({
          id: extId.id,
          externalId: extId.externalId,
          externalSystem: extId.externalSystem,
        })),
        name: found.name,
        headCoach: {
          id: found.headCoach.id,
          externalIds: found.headCoach.externalId.map((extId) => ({
            id: extId.id,
            externalId: extId.externalId,
            externalSystem: extId.externalSystem,
          })),
        },
        coCoach: found.coCoach
          ? {
              id: found.coCoach.id,
              externalIds: found.coCoach.externalId.map((extId) => ({
                id: extId.id,
                externalId: extId.externalId,
                externalSystem: extId.externalSystem,
              })),
            }
          : undefined,
        teamType: {
          id: found.teamType.id,
          externalIds: found.teamType.externalId.map((extId) => ({
            id: extId.id,
            externalId: extId.externalId,
            externalSystem: extId.externalSystem,
          })),
        },
      }
    );
  }

  async findByExternalId(externalId: ExternalId): Promise<Team> {
    // TODO Refactor this to a single Prisma query instead of having to get team by ID after finding externalId
    const found = await this.prisma.externalTeamId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.teamId);
    }
    return undefined;
  }

  async findByReference(reference: TeamReference): Promise<Team> {
    // TODO Reduce number of queries made by using Prisma's and/or mechanisms in a single query (desired external ID might not yet exist though)
    // TODO When finding by multiple references, check if references are contradictory (i.e. refer to different records) or dead (i.e. missing record)
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      for (const extId of reference.externalIds) {
        const found = await this.findByExternalId(extId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  async create(input: Team): Promise<Team> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const headCoach = await this.coachService.findByReference(
      input.headCoach,
    );
    const coCoach = input.coCoach
      ? await this.coachService.findByReference(input.coCoach)
      : undefined;
    const teamType = await this.teamTypeService.findByReference(
      input.teamType,
    );
    return this.wrap(
      await this.prisma.team.create({
        data: {
          externalId: {
            createMany: {
              data: input.externalIds
                ? input.externalIds.map((extId) => ({
                    externalId: extId.externalId,
                    externalSystem: extId.externalSystem,
                  }))
                : [],
            },
          },
          name: input.name,
          headCoach: {
            connect: {
              id: headCoach.id,
            },
          },
          coCoach: coCoach
            ? {
                connect: {
                  id: coCoach.id,
                },
              }
            : undefined,
          teamType: {
            connect: {
              id: teamType.id,
            },
          },
        },
        include: {
          externalId: true,
          headCoach: {
            include: {
              externalId: true,
            },
          },
          coCoach: {
            include: {
              externalId: true,
            },
          },
          teamType: {
            include: {
              externalId: true,
            },
          },
        },
      }),
    );
  }

  async update(input: Team): Promise<Team> {
    // TODO Need to enforce that input has an ID, otherwise this might update all team types?
    return this.wrap(
      await this.prisma.team.update({
        where: {
          id: input.id,
        },
        data: {
          externalId: {
            // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
            createMany: {
              data: input.externalIds
                ? input.externalIds
                    .filter((extId) => !extId.id)
                    .map((extId) => ({
                      externalId: extId.externalId,
                      externalSystem: extId.externalSystem,
                    }))
                : [],
            },
          },
          name: input.name,
          // TODO Support changing of head coach for team?
          // TODO Support changing/adding co-coach for team?
          // TODO Support changing of team type for team?
        },
        include: {
          externalId: true,
          headCoach: {
            include: {
              externalId: true,
            },
          },
          coCoach: {
            include: {
              externalId: true,
            },
          },
          teamType: {
            include: {
              externalId: true,
            },
          },
        },
      }),
    );
  }
}
