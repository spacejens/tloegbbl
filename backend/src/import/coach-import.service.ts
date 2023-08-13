import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportCoach,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './import.interface';

@Injectable()
export class CoachImportService {
  importCoach(
    request: ImportRequestEnvelope<ImportCoach>,
  ): ImportResponseEnvelope<ImportCoach> {
    // TODO Find existing coach if it exists (using internal ID, external ID, name? Verify no conflicting internal/external IDs?)
    // TODO If existing coach found, update it (directives would control if existing data points get overwritten or not)
    // TODO If no existing coach, create new using the input
    // TODO Return the resulting updated/new state of the coach
    return {
      status: ImportResponseStatus.Failed,
    };
  }
}
