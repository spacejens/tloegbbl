import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, Team, TeamReference } from '@tloegbbl/api';
import { TeamTypeService } from './team-type.service';
import { CoachService } from './coach.service';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';

@Injectable()
export class TeamService extends ExternallyIdentifiablePersistenceService<
  TeamReference,
  Team
> {
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
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
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
    };
  }

  async findByExternalId(externalId: ExternalId): Promise<Team> {
    return await this.prisma.team.findFirst({
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

  async create(input: Team): Promise<Team> {
    if (input.id) {
      throw new Error(`Attempting to create team with existing ID ${input.id}`);
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const headCoach = await this.coachService.findByReference(input.headCoach);
    const coCoach = input.coCoach
      ? await this.coachService.findByReference(input.coCoach)
      : undefined;
    const teamType = await this.teamTypeService.findByReference(input.teamType);
    return await this.prisma.team.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
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
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Team): Promise<Team> {
    if (!input.id) {
      throw new Error(
        `Attempting up update team without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.team.update({
      where: {
        id: input.id,
      },
      data: {
        externalIds: this.createAnonymousOf(input.externalIds),
        name: input.name,
        // TODO Support changing of head coach for team?
        // TODO Support changing/adding co-coach for team?
        // TODO Support changing of team type for team?
      },
      include: this.fieldsNeededForTheDto(),
    });
  }
}
