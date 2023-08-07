import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';

@Module({
    providers: [ImportService, FileReaderService, CoachesService, TeamsService],
    exports: [ImportService],
})
export class ImportModule {}
