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
    const found = await this.prisma.coach.findUnique({
      where: {
        id: id,
      },
      include: {
        externalId: true,
      },
    });
    if (found) {
      return {
        id: found.id,
        externalIds: found.externalId.map((extId) => ({
          id: extId.id,
          externalId: extId.externalId,
          externalSystem: extId.externalSystem,
        })),
        name: found.name,
      };
    }
    return undefined;
  }

  async findCoachByExternalId(externalId: ExternalId): Promise<Coach> {
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
    const created = await this.prisma.coach.create({
      data: {
        // TODO Created coach should also have external IDs
        name: input.name,
      },
    });
    // TODO Is it best to gather all output mapping the find-by-id method? Or better to prevent extra queries?
    return this.findCoachById(created.id);
  }

  async updateCoach(input: Coach): Promise<Coach> {
    // TODO Need to enforce that input has an ID, otherwise this might update all coaches?
    const updated = await this.prisma.coach.update({
      where: {
        id: input.id,
      },
      data: {
        // TODO Updated coach should also have external IDs added (but not removed/changed!)
        name: input.name,
      },
    });
    return this.findCoachById(updated.id);
  }
}
