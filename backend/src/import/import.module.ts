import { Module } from '@nestjs/common';
import { CoachImportService } from './coach-import.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { CombineDataService } from './combine-data.service';
import { TeamTypeImportService } from './team-type-import.service';
import { TeamImportService } from './team-import.service';
import { CompetitionImportService } from './competition-import.service';
import { TeamInCompetitionImportService } from './team-in-competition-import.service';

@Module({
  imports: [PersistenceModule],
  providers: [
    CoachImportService,
    CombineDataService,
    TeamTypeImportService,
    TeamImportService,
    CompetitionImportService,
    TeamInCompetitionImportService,
  ],
  exports: [
    CoachImportService,
    TeamTypeImportService,
    TeamImportService,
    CompetitionImportService,
    TeamInCompetitionImportService,
  ],
})
export class ImportModule {}
