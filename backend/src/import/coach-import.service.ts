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
    // TODO Implement importing coaches
    return {
      status: ImportResponseStatus.Failed,
    };
  }
}
