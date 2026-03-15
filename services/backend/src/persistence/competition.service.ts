import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { Competition, CompetitionReference, ExternalId } from '@tloegbbl/api';
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
    return await this.prisma.competition.findFirst({
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

  async create(input: Competition): Promise<Competition> {
    if (input.id) {
      throw new Error(
        `Attempting to create competition with existing ID ${input.id}`,
      );
    }
    return await this.prisma.competition.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Competition): Promise<Competition> {
    if (!input.id) {
      throw new Error(
        `Attempting up update competition without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
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
