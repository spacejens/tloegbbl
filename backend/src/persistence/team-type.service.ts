import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExternalId, TeamType, TeamTypeReference } from '../dtos';

@Injectable()
export class TeamTypeService {
  constructor(private prisma: PrismaService) {}

  async findTeamTypeById(id: number): Promise<TeamType> {
    return this.wrapTeamType(
      await this.prisma.teamType.findUnique({
        where: {
          id: id,
        },
        include: {
          externalId: true,
        },
      }),
    );
  }

  // TODO Signature of wrap method should ideally use a Prisma type as argument
  private wrapTeamType(found: {
    id: number;
    externalId: {
      id: number;
      externalId: string;
      externalSystem: string;
    }[];
    name: string;
  }): TeamType {
    return (
      found && {
        id: found.id,
        externalIds: found.externalId.map((extId) => ({
          id: extId.id,
          externalId: extId.externalId,
          externalSystem: extId.externalSystem,
        })),
        name: found.name,
      }
    );
  }

  async findTeamTypeByExternalId(externalId: ExternalId): Promise<TeamType> {
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
      return this.findTeamTypeById(found.teamTypeId);
    }
    return undefined;
  }

  async findTeamTypeByReference(
    reference: TeamTypeReference,
  ): Promise<TeamType> {
    // TODO Reduce number of queries made by using Prisma's and/or mechanisms in a single query (desired external ID might not yet exist though)
    // TODO When finding by multiple references, check if references are contradictory (i.e. refer to different records) or dead (i.e. missing record)
    if (reference.id) {
      return this.findTeamTypeById(reference.id);
    } else {
      for (const extId of reference.externalIds) {
        const found = await this.findTeamTypeByExternalId(extId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  async createTeamType(input: TeamType): Promise<TeamType> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return this.wrapTeamType(
      await this.prisma.teamType.create({
        data: {
          externalId: {
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
          externalId: true,
        },
      }),
    );
  }

  async updateTeamType(input: TeamType): Promise<TeamType> {
    // TODO Need to enforce that input has an ID, otherwise this might update all team types?
    return this.wrapTeamType(
      await this.prisma.teamType.update({
        where: {
          id: input.id,
        },
        data: {
          externalId: {
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
          externalId: true,
        },
      }),
    );
  }
}
