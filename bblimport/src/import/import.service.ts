import { Injectable } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { TeamsService } from './teams.service';
import { CompetitionsService } from './competitions.service';
import { MatchesService } from './matches.service';
import { PlayersService } from './players.service';

@Injectable()
export class ImportService {
  constructor(
    private readonly coachesService: CoachesService,
    private readonly teamsService: TeamsService,
    private readonly competitionsService: CompetitionsService,
    private readonly matchesService: MatchesService,
    private readonly playersService: PlayersService,
  ) {}

  async importEverything(): Promise<void> {
    await this.coachesService.uploadCoaches(this.coachesService.getCoaches());
    await this.teamsService.uploadTeams(this.teamsService.getTeams());
    await this.playersService.uploadPlayers(this.playersService.getPlayers());
    await this.competitionsService.uploadCompetitions(
      this.competitionsService.getCompetitions(),
    );
    await this.matchesService.uploadMatches(this.matchesService.getMatches());
    console.log('Importing not implemented yet');
    // TODO Import everything by calling specific import functions in the correct order based on data dependencies
  }
}
