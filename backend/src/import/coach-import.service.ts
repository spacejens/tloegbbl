import { Injectable } from '@nestjs/common';
import { Coach, CoachReference } from '@tloegbbl/api';
import { CoachService } from '../persistence/coach.service';
import { CombineDataService } from './combine-data.service';
import { ImportService } from './import.service';

@Injectable()
export class CoachImportService extends ImportService<CoachReference, Coach> {
  constructor(
    readonly persistenceService: CoachService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
