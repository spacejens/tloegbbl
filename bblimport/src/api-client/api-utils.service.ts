import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiable } from '../dtos';

@Injectable()
export class ApiUtilsService {

  externalId(id: string) {
    return (
      id && {
        externalId: id,
        externalSystem: 'tloeg.bbleague.se', // TODO Get externalSystem from configuration
      }
    );
  }

  // TODO What if there are multiple external IDs for the same data? Need to return array instead...
  getExternalId(data: ExternallyIdentifiable): string {
    for (const externalId of data.externalIds) {
      if (externalId.externalSystem == 'tloeg.bbleague.se') {
        // TODO Get externalSystem from configuration
        return externalId.externalId;
      }
    }
    return undefined;
  }
  getExternalIds(data: ExternallyIdentifiable): string[] {
    return data.externalIds
      .filter((value) => value.externalSystem == 'tloeg.bbleague.se') // TODO Get externalSystem from configuration
      .map((value) => value.externalId)
      .sort();
  }

  sameExternalId(dataA: ExternallyIdentifiable, dataB: ExternallyIdentifiable): boolean {
    const idsA = this.getExternalIds(dataA);
    const idsB = this.getExternalIds(dataB);
    return idsA
      .filter((value) => idsB.indexOf(value) > -1)
      .length > 0;
  }
}
