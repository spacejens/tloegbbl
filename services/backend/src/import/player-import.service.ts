import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { Player, PlayerReference } from '@tloegbbl/api';
import { PlayerService } from '../persistence/player.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class PlayerImportService extends ImportService<
  PlayerReference,
  Player
> {
  constructor(
    readonly persistenceService: PlayerService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
