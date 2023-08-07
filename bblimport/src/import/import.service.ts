import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';

@Injectable()
export class ImportService {
    constructor(private readonly fileReaderService: FileReaderService) {}

    importEverything(): void {
        console.log("Importing not implemented yet");
        // TODO Import everything by calling specific import functions in the correct order based on data dependencies
        console.log(this.fileReaderService.readFile('index.html').querySelector('#updnote')); // TODO Remove this call, only temporarily here to make code execute
    }
}
