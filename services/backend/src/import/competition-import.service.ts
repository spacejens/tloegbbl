import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { Competition, CompetitionReference } from '@tloegbbl/api';
import { CompetitionService } from '../persistence/competition.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export class CompetitionImportService extends ImportService<
  CompetitionReference,
  Competition
> {
  constructor(
    readonly persistenceService: CompetitionService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
