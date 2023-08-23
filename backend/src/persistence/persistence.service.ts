import { Injectable } from '@nestjs/common';
import { ExternalId, ExternallyIdentifiable } from '../dtos';

@Injectable()
export abstract class PersistenceService<
  R extends ExternallyIdentifiable,
  E extends R,
> {
  constructor(
    readonly prismaDelegate: {
      count: () => number | PromiseLike<number>;
    },
  ) {}

  // TODO Not sure that trying to duck-type Prisma delegates into the superclass is a good thing? Maybe just keep abstract methods here?
  async count(): Promise<number> {
    return this.prismaDelegate.count();
  }

  abstract findById(id: number): Promise<E>;

  abstract findByExternalId(externalId: ExternalId): Promise<E>;

  async findByReference(reference: R): Promise<E> {
    // TODO Reduce number of queries made by using Prisma's and/or mechanisms in a single query (desired external ID might not yet exist though)
    // TODO When finding by multiple references, check if references are contradictory (i.e. refer to different records) or dead (i.e. missing record)
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      for (const extId of reference.externalIds) {
        const found = await this.findByExternalId(extId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  createAllOf(inputExternalIds: ExternalId[]) {
    return {
      createMany: {
        data: inputExternalIds
          ? inputExternalIds.map((extId) => ({
              externalId: extId.externalId,
              externalSystem: extId.externalSystem,
            }))
          : [],
      },
    };
  }

  createAnonymousOf(inputExternalIds: ExternalId[]) {
    return this.createAllOf(inputExternalIds.filter((extId) => !extId.id));
  }

  abstract create(input: E): Promise<E>;

  abstract update(input: E): Promise<E>;
}
