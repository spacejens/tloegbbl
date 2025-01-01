import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { Trophy, TrophyReference } from '../dtos';
import { TrophyService } from '../persistence/trophy.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class TrophyImportService extends ImportService<
  TrophyReference,
  Trophy
> {
  constructor(
    readonly persistenceService: TrophyService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
