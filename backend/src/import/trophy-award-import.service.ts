import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { TrophyAward, TrophyAwardReference } from '@tloegbbl/api';
import { TrophyAwardService } from '../persistence/trophy-award.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class TrophyAwardImportService extends ImportService<
  TrophyAwardReference,
  TrophyAward
> {
  constructor(
    readonly persistenceService: TrophyAwardService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
