import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { Competition, CompetitionReference, ExternalId } from '../dtos';
import { PrismaService } from './prisma.service';

@Injectable()
export class CompetitionService extends ExternallyIdentifiablePersistenceService<
  CompetitionReference,
  Competition
> {
  constructor(private prisma: PrismaService) {
    super(prisma.competition);
  }

  async findById(id: number): Promise<Competition> {
    return await this.prisma.competition.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async findByExternalId(externalId: ExternalId): Promise<Competition> {
    // TODO Refactor this to a single Prisma query instead of having to get by competition ID after finding externalId
    const found = await this.prisma.externalCompetitionId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.competitionId);
    }
    return undefined;
  }

  async create(input: Competition): Promise<Competition> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return await this.prisma.competition.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Competition): Promise<Competition> {
    // TODO Need to enforce that input has an ID, otherwise this might update all competitions?
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.competition.update({
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
