import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, TeamType, TeamTypeReference } from '../dtos';
import { PersistenceService } from './persistence.service';

@Injectable()
export class TeamTypeService extends PersistenceService<
  TeamTypeReference,
  TeamType
> {
  constructor(private prisma: PrismaService) {
    super(prisma.teamType);
  }

  async findById(id: number): Promise<TeamType> {
    return this.wrap(
      await this.prisma.teamType.findUnique({
        where: {
          id: id,
        },
        include: {
          externalIds: true,
        },
      }),
    );
  }

  // TODO Signature of wrap method should ideally use a Prisma type as argument
  private wrap(found: {
    id: number;
    externalIds: {
      id: number;
      externalId: string;
      externalSystem: string;
    }[];
    name: string;
  }): TeamType {
    return (
      found && {
        id: found.id,
        externalIds: found.externalIds.map((extId) => ({
          id: extId.id,
          externalId: extId.externalId,
          externalSystem: extId.externalSystem,
        })),
        name: found.name,
      }
    );
  }

  async findByExternalId(externalId: ExternalId): Promise<TeamType> {
    // TODO Refactor this to a single Prisma query instead of having to get team type by ID after finding externalId
    const found = await this.prisma.externalTeamTypeId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.teamTypeId);
    }
    return undefined;
  }

  async create(input: TeamType): Promise<TeamType> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return this.wrap(
      await this.prisma.teamType.create({
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
        },
        include: {
          externalIds: true,
        },
      }),
    );
  }

  async update(input: TeamType): Promise<TeamType> {
    // TODO Need to enforce that input has an ID, otherwise this might update all team types?
    return this.wrap(
      await this.prisma.teamType.update({
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
        },
        include: {
          externalIds: true,
        },
      }),
    );
  }
}
