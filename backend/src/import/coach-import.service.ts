import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './envelopes';
import { Coach } from '../dtos';
import { CoachService } from '../persistence/coach.service';

@Injectable()
export class CoachImportService {
  constructor(private readonly coachService: CoachService) {}

  async importCoach(
    request: ImportRequestEnvelope<Coach>,
  ): Promise<ImportResponseEnvelope<Coach>> {
    const found: Coach = await this.coachService.findCoachByReference(
      request.data,
    );
    if (found) {
      const updated = await this.coachService.updateCoach({
        ...request.data,
        ...found,
        // TODO Handle external IDs when combining requested and found coach data
      });
      // TODO Directives should control if existing data points get overwritten or not (but not the identity/reference fields)
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
