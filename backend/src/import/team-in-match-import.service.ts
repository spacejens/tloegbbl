import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { TeamInMatch, TeamInMatchReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { TeamInMatchService } from '../persistence/team-in-match.service';

@Injectable()
export class TeamInMatchImportService extends ImportService<
  TeamInMatchReference,
  TeamInMatch
> {
  constructor(
    readonly persistenceService: TeamInMatchService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
