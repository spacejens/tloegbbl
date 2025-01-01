import { Injectable } from '@nestjs/common';
import { ExternalId, ExternallyIdentifiable } from '../dtos';

type Validate<T> = Pick<
  T,
  {
    [Prop in keyof T]: T[Prop] extends null | undefined ? never : Prop;
  }[keyof T]
>;

@Injectable()
export class CombineDataService {
  preferFound<T extends ExternallyIdentifiable>(requested: T, found: T): T {
    return {
      ...requested,
      ...this.keepOnlyPropsWithValues(found),
      id: found.id,
      externalIds: this.combineExternalIds(
        requested.externalIds,
        found.externalIds,
      ),
    };
  }

  private keepOnlyPropsWithValues<T extends ExternallyIdentifiable>(
    obj: T,
  ): Validate<T> {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [
          k,
          v === Object(v) && Object.entries(v).length > 0
            ? this.keepOnlyPropsWithValues(v)
            : v,
        ]),
    ) as Validate<T>;
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
