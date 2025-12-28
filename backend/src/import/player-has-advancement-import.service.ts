import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { PlayerHasAdvancement, PlayerHasAdvancementReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { PlayerHasAdvancementService } from '../persistence/player-has-advancement.service';

@Injectable()
export class PlayerHasAdvancementImportService extends ImportService<
  PlayerHasAdvancementReference,
  PlayerHasAdvancement
> {
  constructor(
    readonly persistenceService: PlayerHasAdvancementService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
