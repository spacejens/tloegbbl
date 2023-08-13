import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './envelopes';
import { Coach } from '../dtos';

@Injectable()
export class CoachImportService {
  importCoach(
    request: ImportRequestEnvelope<Coach>,
  ): ImportResponseEnvelope<Coach> {
    // TODO Find existing coach if it exists (using internal ID, external ID, name? Verify no conflicting internal/external IDs?)
    // TODO If existing coach found, update it (directives would control if existing data points get overwritten or not)
    // TODO If no existing coach, create new using the input
    // TODO Return the resulting updated/new state of the coach
    return {
      status: ImportResponseStatus.Failed,
    };
  }
}
