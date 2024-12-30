import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { ExternalId, Trophy, TrophyCategory, TrophyReference } from '../dtos';
import { PrismaService } from './prisma.service';
import { Prisma, $Enums } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class TrophyService extends ExternallyIdentifiablePersistenceService<
  TrophyReference,
  Trophy
> {
  constructor(private prisma: PrismaService) {
    super(prisma.trophy);
  }

  async findById(id: number): Promise<Trophy> {
    return await this.wrap(
      this.prisma.trophy.findUnique({
        where: {
          id: id,
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  async findByExternalId(externalId: ExternalId): Promise<Trophy> {
    return await this.wrap(
      this.prisma.trophy.findFirst({
        where: {
          externalIds: {
            some: {
              externalId: externalId.externalId,
              externalSystem: externalId.externalSystem,
            },
          },
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  async create(input: Trophy): Promise<Trophy> {
    if (input.id) {
      throw new Error(
        `Attempting to create trophy with existing ID ${input.id}`,
      );
    }
    return await this.wrap(
      this.prisma.trophy.create({
        data: {
          externalIds: this.createAllOf(input.externalIds),
          name: input.name,
          trophyCategory: input.trophyCategory,
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  async update(input: Trophy): Promise<Trophy> {
    if (!input.id) {
      throw new Error(
        `Attempting up update trophy without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    // TODO Test/check with external IDs in the DB that the input doesn't know about (currently prevented by import service finding first)
    return await this.wrap(
      this.prisma.trophy.update({
        where: {
          id: input.id,
        },
        data: {
          externalIds: this.createAnonymousOf(input.externalIds),
          name: input.name,
          trophyCategory: input.trophyCategory,
        },
        include: this.fieldsNeededForTheDto(),
      }),
    );
  }

  // TODO Possible to avoid huge type declaration here? Use any? Or some Prisma generated type?
  private async wrap(
    input: Prisma.Prisma__TrophyClient<
      {
        externalIds: {
          id: number;
          externalId: string;
          externalSystem: string;
          trophyId: number;
        }[];
      } & {
        name: string;
        trophyCategory: $Enums.TrophyCategory;
        id: number;
      },
      null,
      DefaultArgs
    >,
  ): Promise<Trophy> {
    const entity = await input;
    return (
      entity && {
        id: entity.id,
        externalIds: entity.externalIds,
        name: entity.name,
        trophyCategory: TrophyCategory[entity.trophyCategory],
      }
    );
  }
}
