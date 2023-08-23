import { Module } from '@nestjs/common';
import { CoachImportService } from './coach-import.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { CombineDataService } from './combine-data.service';
import { TeamTypeImportService } from './team-type-import.service';
import { TeamImportService } from './team-import.service';

@Module({
  imports: [PersistenceModule],
  providers: [
    CoachImportService,
    CombineDataService,
    TeamTypeImportService,
    TeamImportService,
  ],
  exports: [CoachImportService, TeamTypeImportService, TeamImportService],
})
export class ImportModule {}
