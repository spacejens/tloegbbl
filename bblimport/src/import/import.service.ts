import { Injectable } from '@nestjs/common';
import { CoachesService } from './coaches.service';

@Injectable()
export class ImportService {
    constructor(private readonly coachesService: CoachesService) {}

    importEverything(): void {
        this.coachesService.uploadCoaches(this.coachesService.getCoaches());
        console.log("Importing not implemented yet");
        // TODO Import everything by calling specific import functions in the correct order based on data dependencies
    }
}
