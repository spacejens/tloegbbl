import { Injectable } from '@nestjs/common';
import { ExternalId, ExternallyIdentifiable } from '../dtos';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';

@Injectable()
export abstract class ExternallyIdentifiablePersistenceService<
  R extends ExternallyIdentifiable,
  E extends R,
> extends IdentifiablePersistenceService<R, E> {
  constructor(
    readonly prismaDelegate: {
      count: () => number | PromiseLike<number>;
    },
  ) {
    super(prismaDelegate);
  }

  fieldsNeededForTheDto() {
    // This will be overridden and expanded upon by those subclasses that need more
    return {
      externalIds: true,
    };
  }

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
    if (inputExternalIds && inputExternalIds.filter((extId) => extId.id).length > 0) {
      throw new Error(`Attempting to create external IDs that already exist in DB`);
    }
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
}
