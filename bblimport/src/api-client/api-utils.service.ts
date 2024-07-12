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
}
