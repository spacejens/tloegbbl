import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';
import { HttpModule } from '@nestjs/axios';
import { TeamTypesService } from './team-types.service';
import { CompetitionsService } from './competitions.service';

@Module({
  imports: [HttpModule],
  providers: [
    ImportService,
    FileReaderService,
    CoachesService,
    TeamsService,
    TeamTypesService,
    CompetitionsService,
  ],
  exports: [ImportService],
})
export class ImportModule {}
