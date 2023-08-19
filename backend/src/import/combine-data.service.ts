import { Injectable } from '@nestjs/common';
import { Coach, ExternalId, ExternallyIdentifiable } from '../dtos';

@Injectable()
export class CombineDataService {
  combineData<T extends ExternallyIdentifiable>(requested: T, found: T): T {
    // TODO Directives should control if existing data points get overwritten or not (but not the identity/reference fields)
    return {
      ...requested,
      ...found,
      id: found.id,
      externalIds: this.combineExternalIds(
        requested.externalIds,
        found.externalIds,
      ),
    };
  }

  private combineExternalIds(
    alpha: ExternalId[],
    beta: ExternalId[],
  ): ExternalId[] {
    if (!alpha) {
      return beta;
    }
    if (!beta) {
      return alpha;
    }
    const combined = [...alpha, ...beta];
    // First, add all input objects that have an ID already
    const output = combined.filter((externalId) => externalId.id);
    // Then, check all input objects that don't have an ID, adding them if not already present
    combined
      .filter((externalId) => !externalId.id)
      .forEach((externalId) => {
        const foundIndex = output.findIndex((value) => {
          return (
            externalId.externalSystem === value.externalSystem &&
            externalId.externalId === value.externalId
          );
        });
        if (foundIndex === -1) {
          output.push(externalId);
        }
      });
    return output;
  }
}
