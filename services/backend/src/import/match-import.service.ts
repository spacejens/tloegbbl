import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { Match, MatchReference } from '@tloegbbl/api';
import { MatchService } from '../persistence/match.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class MatchImportService extends ImportService<MatchReference, Match> {
  constructor(
    readonly persistenceService: MatchService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
