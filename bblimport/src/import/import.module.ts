import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';

@Module({
    providers: [ImportService, FileReaderService, CoachesService],
    exports: [ImportService],
})
export class ImportModule {}
