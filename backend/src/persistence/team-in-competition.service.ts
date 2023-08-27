import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { TeamInCompetition, TeamInCompetitionReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';

@Injectable()
export class TeamInCompetitionService extends IdentifiablePersistenceService<
  TeamInCompetitionReference,
  TeamInCompetition
> {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamService,
    private competitionService: CompetitionService,
  ) {
    super(prisma.teamInCompetition);
  }

  async findById(id: number): Promise<TeamInCompetition> {
    return await this.prisma.teamInCompetition.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      team: {
        include: {
          externalIds: true,
        },
      },
      competition: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByReference(
    reference: TeamInCompetitionReference,
  ): Promise<TeamInCompetition> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const team = await this.teamService.findByReference(reference.team);
      const competition = await this.competitionService.findByReference(
        reference.competition,
      );
      if (team && competition) {
        const results = await this.prisma.teamInCompetition.findMany({
          where: {
            team: {
              id: team.id,
            },
            competition: {
              id: competition.id,
            },
          },
          include: this.fieldsNeededForTheDto(),
        });
        if (results.length == 1) {
          return results[0];
        } else if (results.length > 1) {
          throw new Error(
            `Found ${results.length} records for team ${team.id} in competition ${competition.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(input: TeamInCompetition): Promise<TeamInCompetition> {
    if (input.id) {
      throw new Error(`Attempting to create team in competition with existing ID ${input.id}`);
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const team = await this.teamService.findByReference(input.team);
    if (!team) {
      throw new Error(`Failed to find team: ${JSON.stringify(input.team)}`);
    }
    const competition = await this.competitionService.findByReference(
      input.competition,
    );
    if (!competition) {
      throw new Error(
        `Failed to find competition: ${JSON.stringify(input.competition)}`,
      );
    }
    return await this.prisma.teamInCompetition.create({
      data: {
        team: {
          connect: {
            id: team.id,
          },
        },
        competition: {
          connect: {
            id: competition.id,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: TeamInCompetition): Promise<TeamInCompetition> {
    // TODO Need to enforce that input has an ID, otherwise this might update all records?
    return await this.prisma.teamInCompetition.update({
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
