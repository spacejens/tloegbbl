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
import { PlayerTypeImportService } from './player-type-import.service';
import { AdvancementImportService } from './advancement-import.service';
import { PlayerHasAdvancementImportService } from './player-has-advancement-import.service';
import { PlayerTypeHasAdvancementImportService } from './player-type-has-advancement-import.service';
import { PlayerTypeInTeamTypeImportService } from './player-type-in-team-type-import.service';
import { MatchEventImportService } from './match-event-import.service';
import { TrophyImportService } from './trophy-import.service';
import { TrophyAwardImportService } from './trophy-award-import.service';

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
    PlayerTypeImportService,
    AdvancementImportService,
    PlayerHasAdvancementImportService,
    PlayerTypeHasAdvancementImportService,
    PlayerTypeInTeamTypeImportService,
    MatchEventImportService,
    TrophyImportService,
    TrophyAwardImportService,
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
    PlayerTypeImportService,
    AdvancementImportService,
    PlayerHasAdvancementImportService,
    PlayerTypeHasAdvancementImportService,
    PlayerTypeInTeamTypeImportService,
    MatchEventImportService,
    TrophyImportService,
    TrophyAwardImportService,
  ],
})
export class ImportModule {}
