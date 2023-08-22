import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';
import { HttpModule } from '@nestjs/axios';
import { TeamTypesService } from './team-types.service';

@Module({
  imports: [HttpModule],
  providers: [ImportService, FileReaderService, CoachesService, TeamsService, TeamTypesService],
  exports: [ImportService],
})
export class ImportModule {}
