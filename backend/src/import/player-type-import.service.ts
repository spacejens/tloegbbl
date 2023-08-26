import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { PlayerType, PlayerTypeReference } from '../dtos';
import { PlayerTypeService } from '../persistence/player-type.service';
import { ImportService } from './import.service';

@Injectable()
export class PlayerTypeImportService extends ImportService<
  PlayerTypeReference,
  PlayerType
> {
  constructor(
    readonly persistenceService: PlayerTypeService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
