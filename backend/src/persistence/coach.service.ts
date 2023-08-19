import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Coach, CoachReference, ExternalId } from '../dtos';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {}

  async countCoaches(): Promise<number> {
    return this.prisma.coach.count();
  }

  async findCoachById(id: number): Promise<Coach> {
    return this.wrapCoach(
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

  private wrapCoach(found: {
    id: number;
    externalId: { id: number; externalId: string; externalSystem: string }[];
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

  async findCoachByExternalId(externalId: ExternalId): Promise<Coach> {
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
      return this.findCoachById(found.coachId);
    }
    return undefined;
  }

  async findCoachByReference(reference: CoachReference): Promise<Coach> {
    // TODO Reduce number of queries made by using Prisma's and/or mechanisms in a single query (desired external ID might not yet exist though)
    // TODO When finding by multiple references, check if references are contradictory (i.e. refer to different records) or dead (i.e. missing record)
    if (reference.id) {
      return this.findCoachById(reference.id);
    } else {
      for (const extId of reference.externalIds) {
        const found = await this.findCoachByExternalId(extId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  async createCoach(input: Coach): Promise<Coach> {
    return this.wrapCoach(
      await this.prisma.coach.create({
        data: {
          externalId: {
            createMany: {
              data: input.externalIds.map((extId) => ({
                externalId: extId.externalId,
                externalSystem: extId.externalSystem,
              })),
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

  async updateCoach(input: Coach): Promise<Coach> {
    // TODO Need to enforce that input has an ID, otherwise this might update all coaches?
    return this.wrapCoach(
      await this.prisma.coach.update({
        where: {
          id: input.id,
        },
        data: {
          // TODO Updated coach should also have external IDs added (but not removed/changed!)
          name: input.name,
        },
        include: {
          externalId: true,
        },
      }),
    );
  }
}
