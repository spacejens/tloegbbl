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
    const found: Coach = await this.coachService.findCoachByReference({
      id: request.data.id,
      externalIds: request.data.externalIds.map((reqExtId) => ({
        externalId: reqExtId.externalId,
        externalSystem: reqExtId.externalSystem,
      })),
    });
    // TODO If existing coach found, update it (directives would control if existing data points get overwritten or not)
    // TODO If no existing coach, create new using the input
    // TODO Return the resulting updated/new state of the coach
    return {
      status: ImportResponseStatus.Failed,
    };
  }
}
