import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { TeamInMatch, TeamInMatchReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { TeamService } from './team.service';
import { MatchService } from './match.service';

@Injectable()
export class TeamInMatchService extends IdentifiablePersistenceService<
  TeamInMatchReference,
  TeamInMatch
> {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamService,
    private matchService: MatchService,
  ) {
    super(prisma.teamInMatch);
  }

  async findById(id: number): Promise<TeamInMatch> {
    return await this.prisma.teamInMatch.findUnique({
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
      match: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByReference(reference: TeamInMatchReference): Promise<TeamInMatch> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const team = await this.teamService.findByReference(reference.team);
      const match = await this.matchService.findByReference(reference.match);
      if (team && match) {
        const results = await this.prisma.teamInMatch.findMany({
          where: {
            team: {
              id: team.id,
            },
            match: {
              id: match.id,
            },
          },
          include: this.fieldsNeededForTheDto(),
        });
        if (results.length == 1) {
          return results[0];
        } else if (results.length > 1) {
          throw new Error(
            `Found ${results.length} records for team ${team.id} in match ${match.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(input: TeamInMatch): Promise<TeamInMatch> {
    // TODO Should enforce that input is missing DB ID, otherwise something has gone wrong
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const team = await this.teamService.findByReference(input.team);
    if (!team) {
      throw new Error(`Failed to find team: ${JSON.stringify(input.team)}`);
    }
    const match = await this.matchService.findByReference(input.match);
    if (!match) {
      throw new Error(`Failed to find match: ${JSON.stringify(input.match)}`);
    }
    return await this.prisma.teamInMatch.create({
      data: {
        team: {
          connect: {
            id: team.id,
          },
        },
        match: {
          connect: {
            id: match.id,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: TeamInMatch): Promise<TeamInMatch> {
    // TODO Need to enforce that input has an ID, otherwise this might update all records?
    return await this.prisma.teamInMatch.update({
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
