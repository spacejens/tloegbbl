import { Injectable } from '@nestjs/common';
import {
  ImportRequestEnvelope,
  ImportResponseEnvelope,
  ImportResponseStatus,
} from './envelopes';
import { Coach, ExternalId } from '../dtos';
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
      // TODO Extract combination of request/found data to a generic helper method in the superclass (or two methods, with/without external ID)
      const updated = await this.coachService.updateCoach({
        ...request.data,
        ...found,
        externalIds: this.combineExternalIds(
          request.data.externalIds,
          found.externalIds,
        ),
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

  private combineExternalIds(
    alpha: ExternalId[],
    beta: ExternalId[],
  ): ExternalId[] {
    // TODO Move this method to a superclass of the various import services
    const combined = [...alpha, ...beta];
    // First, add all input objects that have an ID already
    const output = combined.filter((externalId) => externalId.id);
    // Then, check all input objects that don't have an ID, adding them if not already present
    combined
      .filter((externalId) => !externalId.id)
      .forEach((externalId) => {
        const foundIndex = output.findIndex((value) => {
          return (
            externalId.externalSystem === value.externalSystem &&
            externalId.externalId === value.externalId
          );
        });
        if (foundIndex === -1) {
          output.push(externalId);
        }
      });
    return output;
  }
}
