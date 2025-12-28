import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { TeamInCompetition, TeamInCompetitionReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { TeamInCompetitionService } from '../persistence/team-in-competition.service';

@Injectable()
export class TeamInCompetitionImportService extends ImportService<
  TeamInCompetitionReference,
  TeamInCompetition
> {
  constructor(
    readonly persistenceService: TeamInCompetitionService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
