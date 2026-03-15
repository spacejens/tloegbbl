import { Injectable } from '@nestjs/common';
import { TeamService } from '../persistence/team.service';
import { CombineDataService } from './combine-data.service';
import { Team, TeamReference } from '@tloegbbl/api';
import { ImportService } from './import.service';

@Injectable()
export class TeamImportService extends ImportService<TeamReference, Team> {
  constructor(
    readonly persistenceService: TeamService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
