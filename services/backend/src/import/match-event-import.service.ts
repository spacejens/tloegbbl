import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { MatchEvent, MatchEventReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { MatchEventService } from '../persistence/match-event.service';

@Injectable()
export class MatchEventImportService extends ImportService<
  MatchEventReference,
  MatchEvent
> {
  constructor(
    readonly persistenceService: MatchEventService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
