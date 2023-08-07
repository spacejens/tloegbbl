import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { FileReaderService } from './filereader.service';

@Module({
    providers: [ImportService, FileReaderService],
    exports: [ImportService],
})
export class ImportModule {}
