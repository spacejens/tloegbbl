import { Injectable } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';

@Injectable()
export class ImportService {
    constructor(
        private readonly coachesService: CoachesService,
        private readonly teamsService: TeamsService,
    ) {}

    importEverything(): void {
        // TODO General import note: Make all uploads return the uploaded array, so it can be used (and added to) elsewhere (e.g. teams uploading their team types if unavailable in the list)
        this.coachesService.uploadCoaches(this.coachesService.getCoaches());
        // TODO Import team types before importing teams (note that some team types are no longer in the list although they do have an ID, e.g. Simyin for Djungelvrålarna)
        this.teamsService.uploadTeams(this.teamsService.getTeams());
        console.log("Importing not implemented yet");
        // TODO Import everything by calling specific import functions in the correct order based on data dependencies
    }
}
