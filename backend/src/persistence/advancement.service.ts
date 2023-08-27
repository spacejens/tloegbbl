import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, Advancement, AdvancementReference } from '../dtos';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';

@Injectable()
export class AdvancementService extends ExternallyIdentifiablePersistenceService<
  AdvancementReference,
  Advancement
> {
  constructor(private prisma: PrismaService) {
    super(prisma.advancement);
  }

  async findById(id: number): Promise<Advancement> {
    return await this.prisma.advancement.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async findByExternalId(externalId: ExternalId): Promise<Advancement> {
    return await this.prisma.advancement.findFirst({
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

  async create(input: Advancement): Promise<Advancement> {
    if (input.id) {
      throw new Error(
        `Attempting to create advancement with existing ID ${input.id}`,
      );
    }
    return await this.prisma.advancement.create({
      data: {
        externalIds: this.createAllOf(input.externalIds),
        name: input.name,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: Advancement): Promise<Advancement> {
    if (!input.id) {
      throw new Error(
        `Attempting up update advancement without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.prisma.advancement.update({
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
