import { Injectable } from '@nestjs/common';
import { ImportService } from './import.service';
import { Advancement, AdvancementReference } from '@tloegbbl/api';
import { CombineDataService } from './combine-data.service';
import { AdvancementService } from '../persistence/advancement.service';

@Injectable()
export class AdvancementImportService extends ImportService<
  AdvancementReference,
  Advancement
> {
  constructor(
    readonly persistenceService: AdvancementService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}
