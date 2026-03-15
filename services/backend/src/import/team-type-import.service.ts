import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { TeamType, TeamTypeReference } from '@tloegbbl/api';
import { TeamTypeService } from '../persistence/team-type.service';
import { ImportService } from './import.service';

@Injectable()
export class TeamTypeImportService extends ImportService<
  TeamTypeReference,
  TeamType
> {
  constructor(
    readonly persistenceService: TeamTypeService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
