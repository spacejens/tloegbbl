import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './envelopes';
import { Coach, CoachReference } from '../dtos';
import { CoachService } from '../persistence/coach.service';
import { CombineDataService } from './combine-data.service';
import { ImportService } from './import.service';

@Injectable()
export class CoachImportService extends ImportService<CoachReference, Coach> {
  constructor(
    readonly persistenceService: CoachService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }

  async importCoach(
    request: ImportRequestEnvelope<Coach>,
  ): Promise<ImportResponseEnvelope<Coach>> {
    const found: Coach = await this.persistenceService.findByReference(
      request.data,
    );
    if (found) {
      const updated = await this.persistenceService.update(
        this.combineDataService.preferFound(request.data, found),
      );
      return {
        status: ImportResponseStatus.Updated,
        data: updated,
      };
    } else {
      const created = await this.persistenceService.create(request.data);
      return {
        status: ImportResponseStatus.Inserted,
        data: created,
      };
    }
  }
}
