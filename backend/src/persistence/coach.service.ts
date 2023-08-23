import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Coach, CoachReference, ExternalId } from '../dtos';
import { PersistenceService } from './persistence.service';

@Injectable()
export class CoachService extends PersistenceService<CoachReference, Coach> {
  constructor(private prisma: PrismaService) {
    super(prisma.coach);
  }

  async findById(id: number): Promise<Coach> {
    return this.wrap(
      await this.prisma.coach.findUnique({
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
  private wrap(found: {
    id: number;
    externalId: {
      id: number;
      externalId: string;
      externalSystem: string;
    }[];
    name: string;
  }): Coach {
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

  async findByExternalId(externalId: ExternalId): Promise<Coach> {
    // TODO Refactor this to a single Prisma query instead of having to get coach by ID after finding externalId
    const found = await this.prisma.externalCoachId.findUnique({
      where: {
        externalId_externalSystem: {
          externalId: externalId.externalId,
          externalSystem: externalId.externalSystem,
        },
      },
    });
    if (found) {
      return this.findById(found.coachId);
    }
    return undefined;
  }

  async create(input: Coach): Promise<Coach> {
    // TODO Should enforce that input and external IDs are all missing DB IDs, otherwise something has gone wrong
    return this.wrap(
      await this.prisma.coach.create({
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

  async update(input: Coach): Promise<Coach> {
    // TODO Need to enforce that input has an ID, otherwise this might update all coaches?
    return this.wrap(
      await this.prisma.coach.update({
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
