import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import {
  PlayerTypeHasAdvancement,
  PlayerTypeHasAdvancementReference,
} from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { PlayerTypeHasAdvancementService } from '../persistence/player-type-has-advancement.service';

@Injectable()
export class PlayerTypeHasAdvancementImportService extends ImportService<
  PlayerTypeHasAdvancementReference,
  PlayerTypeHasAdvancement
> {
  constructor(
    readonly persistenceService: PlayerTypeHasAdvancementService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
