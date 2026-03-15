import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { PlayerTypeInTeamType, PlayerTypeInTeamTypeReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { PlayerTypeInTeamTypeService } from '../persistence/player-type-in-team-type.service';

@Injectable()
export class PlayerTypeInTeamTypeImportService extends ImportService<
  PlayerTypeInTeamTypeReference,
  PlayerTypeInTeamType
> {
  constructor(
    readonly persistenceService: PlayerTypeInTeamTypeService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
