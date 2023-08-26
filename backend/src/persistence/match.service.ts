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
    // TODO Refactor this to a single Prisma query instead of having to get by ID after finding externalId
    const found = await this.prisma.externalMatchId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.matchId);
    }
    return undefined;
  }

  async create(input: Match): Promise<Match> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
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
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Match): Promise<Match> {
    // TODO Need to enforce that input has an ID, otherwise this might update all?
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.match.update({
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
