import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './envelopes';
import { Coach } from '../dtos';
import { CoachService } from '../persistence/coach.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class CoachImportService {
  constructor(
    private readonly coachService: CoachService,
    private readonly combineDataService: CombineDataService,
  ) {}

  async import(requested: Coach): Promise<Coach> {
    const found: Coach = await this.coachService.findCoachByReference(
      requested,
    );
    if (found) {
      return await this.coachService.updateCoach(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.coachService.createCoach(requested);
    }
  }

  async importCoach(
    request: ImportRequestEnvelope<Coach>,
  ): Promise<ImportResponseEnvelope<Coach>> {
    const found: Coach = await this.coachService.findCoachByReference(
      request.data,
    );
    if (found) {
      const updated = await this.coachService.updateCoach(
        this.combineDataService.preferFound(request.data, found),
      );
      return {
        status: ImportResponseStatus.Updated,
        data: updated,
      };
    } else {
      const created = await this.coachService.createCoach(request.data);
      return {
        status: ImportResponseStatus.Inserted,
        data: created,
      };
    }
  }
}
