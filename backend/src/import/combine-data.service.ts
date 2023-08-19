import { Injectable } from '@nestjs/common';
import { Coach, ExternalId } from '../dtos';

@Injectable()
export class CombineDataService {
  combineData(requested: Coach, found: Coach): Coach {
    // TODO Make this method generic (requires common superclass of all externally identifiable DTOs)
    // TODO Directives should control if existing data points get overwritten or not (but not the identity/reference fields)
    return {
      ...requested,
      ...found,
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
    // TODO Make this method private once only used by other methods in this class
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
