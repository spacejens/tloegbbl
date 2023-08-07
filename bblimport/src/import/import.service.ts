import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportService {
    importEverything(): void {
        console.log("Importing not implemented yet");
        // TODO Import everything by calling specific import functions in the correct order based on data dependencies
    }
}
