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
    requested: ExternalId[],
    found: ExternalId[],
  ): ExternalId[] {
    if (!requested) {
      return found;
    }
    const output = found ? [...found] : [];
    requested
      .filter(
        (reqExtId) =>
          output.findIndex((value) => {
            return (
              reqExtId.externalSystem === value.externalSystem &&
              reqExtId.externalId === value.externalId
            );
          }) === -1,
      )
      .forEach((reqExtId) =>
        output.push({
          externalId: reqExtId.externalId,
          externalSystem: reqExtId.externalSystem,
        }),
      );
    return output;
  }
}
