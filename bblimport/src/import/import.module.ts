import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';
import { TeamTypesService } from './team-types.service';
import { CompetitionsService } from './competitions.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { MatchesService } from './matches.service';
import { PlayersService } from './players.service';

@Module({
  imports: [ApiClientModule],
  providers: [
    ImportService,
    FileReaderService,
    CoachesService,
    TeamsService,
    TeamTypesService,
    CompetitionsService,
    MatchesService,
    PlayersService,
  ],
  exports: [ImportService],
})
export class ImportModule {}
