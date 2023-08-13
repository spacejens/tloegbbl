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
      // TODO Update existing coach
      // TODO Directives should control if existing data points get overwritten or not
      // TODO Return the updated state of the coach
    } else {
      const created = await this.coachService.createCoach(request.data);
      return {
        status: ImportResponseStatus.Inserted,
        data: created,
      };
    }
    // TODO Remove this failed return once no longer reachable
    return {
      status: ImportResponseStatus.Failed,
    };
  }
}
