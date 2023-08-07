import { Injectable } from '@nestjs/common';

@Injectable()
export class SanityCheckService {
    sanityCheckEverything(): void {
        console.log("Sanity checking not implemented yet");
        // TODO Sanity check as much data as possible by getting the imported data from the backend and comparing it against non-used input files
    }
}
