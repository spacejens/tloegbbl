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
    super(prisma.team);
  }

  async findById(id: number): Promise<Team> {
    return await this.prisma.team.findUnique({
      where: {
        id: id,
      },
      include: {
        externalIds: true,
        headCoach: {
          include: {
            externalIds: true,
          },
        },
        coCoach: {
          include: {
            externalIds: true,
          },
        },
        teamType: {
          include: {
            externalIds: true,
          },
        },
      },
    });
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

  async create(input: Team): Promise<Team> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const headCoach = await this.coachService.findByReference(input.headCoach);
    const coCoach = input.coCoach
      ? await this.coachService.findByReference(input.coCoach)
      : undefined;
    const teamType = await this.teamTypeService.findByReference(input.teamType);
    return await this.prisma.team.create({
      data: {
        externalIds: {
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
        externalIds: true,
        headCoach: {
          include: {
            externalIds: true,
          },
        },
        coCoach: {
          include: {
            externalIds: true,
          },
        },
        teamType: {
          include: {
            externalIds: true,
          },
        },
      },
    });
  }

  async update(input: Team): Promise<Team> {
    // TODO Need to enforce that input has an ID, otherwise this might update all team types?
    return await this.prisma.team.update({
      where: {
        id: input.id,
      },
      data: {
        externalIds: {
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
        externalIds: true,
        headCoach: {
          include: {
            externalIds: true,
          },
        },
        coCoach: {
          include: {
            externalIds: true,
          },
        },
        teamType: {
          include: {
            externalIds: true,
          },
        },
      },
    });
  }
}
