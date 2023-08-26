import { Module } from '@nestjs/common';
import { CoachImportService } from './coach-import.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { CombineDataService } from './combine-data.service';
import { TeamTypeImportService } from './team-type-import.service';
import { TeamImportService } from './team-import.service';
import { CompetitionImportService } from './competition-import.service';
import { TeamInCompetitionImportService } from './team-in-competition-import.service';
import { MatchImportService } from './match-import.service';
import { TeamInMatchImportService } from './team-in-match-import.service';
import { PlayerImportService } from './player-import.service';

@Module({
  imports: [PersistenceModule],
  providers: [
    CoachImportService,
    CombineDataService,
    TeamTypeImportService,
    TeamImportService,
    CompetitionImportService,
    TeamInCompetitionImportService,
    MatchImportService,
    TeamInMatchImportService,
    PlayerImportService,
  ],
  exports: [
    CoachImportService,
    TeamTypeImportService,
    TeamImportService,
    CompetitionImportService,
    TeamInCompetitionImportService,
    MatchImportService,
    TeamInMatchImportService,
    PlayerImportService,
  ],
})
export class ImportModule {}
