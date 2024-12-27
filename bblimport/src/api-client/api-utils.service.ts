import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternallyIdentifiable } from '../dtos';

@Injectable()
export class ApiUtilsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  externalId(id: string) {
    return (
      id && {
        externalId: id,
        externalSystem: this.configService.get('EXTERNAL_SYSTEM'),
      }
    );
  }

  // TODO What if there are multiple external IDs for the same data? Need to return array instead...
  getExternalId(data: ExternallyIdentifiable): string {
    for (const externalId of data.externalIds) {
      if (externalId.externalSystem == this.configService.get('EXTERNAL_SYSTEM')) {
        return externalId.externalId;
      }
    }
    return undefined;
  }
  getExternalIds(data: ExternallyIdentifiable): string[] {
    return data.externalIds
      .filter((value) => value.externalSystem == this.configService.get('EXTERNAL_SYSTEM'))
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
