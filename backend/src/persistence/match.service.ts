import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { ExternalId, Match, MatchReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { CompetitionService } from './competition.service';

@Injectable()
export class MatchService extends ExternallyIdentifiablePersistenceService<
  MatchReference,
  Match
> {
  constructor(
    private prisma: PrismaService,
    private competitionService: CompetitionService,
  ) {
    super(prisma.match);
  }

  async findById(id: number): Promise<Match> {
    return await this.prisma.match.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      externalIds: true,
      competition: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByExternalId(externalId: ExternalId): Promise<Match> {
    return await this.prisma.match.findFirst({
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

  async create(input: Match): Promise<Match> {
    if (input.id) {
      throw new Error(
        `Attempting to create match with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const competition = await this.competitionService.findByReference(
      input.competition,
    );
    return await this.prisma.match.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
        competition: {
          connect: {
            id: competition.id,
          },
        },
        playedAt: input.playedAt,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Match): Promise<Match> {
    if (!input.id) {
      throw new Error(
        `Attempting up update match without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.match.update({
      where: {
        id: input.id,
      },
      data: {
        externalIds: this.createAnonymousOf(input.externalIds),
        name: input.name,
        playedAt: input.playedAt,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }
}
