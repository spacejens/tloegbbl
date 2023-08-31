import { Controller, Get } from '@nestjs/common';
import { CoachService } from './coach.service';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';
import { TeamInCompetitionService } from './team-in-competition.service';
import { MatchService } from './match.service';
import { TeamInMatchService } from './team-in-match.service';
import { PlayerService } from './player.service';
import { PlayerTypeService } from './player-type.service';
import { AdvancementService } from './advancement.service';
import { PlayerHasAdvancementService } from './player-has-advancement.service';
import { PlayerTypeHasAdvancementService } from './player-type-has-advancement.service';
import { PlayerTypeInTeamTypeService } from './player-type-in-team-type.service';

@Controller('count')
export class CountController {
  constructor(
    private readonly coachService: CoachService,
    private readonly teamTypeService: TeamTypeService,
    private readonly teamService: TeamService,
    private readonly competitionService: CompetitionService,
    private readonly teamInCompetitionService: TeamInCompetitionService,
    private readonly matchService: MatchService,
    private readonly teamInMatchService: TeamInMatchService,
    private readonly playerService: PlayerService,
    private readonly playerTypeService: PlayerTypeService,
    private readonly advancementService: AdvancementService,
    private readonly playerHasAdvancementService: PlayerHasAdvancementService,
    private readonly playerTypeHasAdvancementService: PlayerTypeHasAdvancementService,
    private readonly playerTypeInTeamTypeService: PlayerTypeInTeamTypeService,
  ) {}

  @Get()
  async countEverything() {
    return {
      coaches: await this.coachService.count(),
      teamTypes: await this.teamTypeService.count(),
      teams: await this.teamService.count(),
      competitions: await this.competitionService.count(),
      teamsInCompetitions: await this.teamInCompetitionService.count(),
      matches: await this.matchService.count(),
      teamsInMatches: await this.teamInMatchService.count(),
      players: await this.playerService.count(),
      playerTypes: await this.playerTypeService.count(),
      advancements: await this.advancementService.count(),
      playerHasAdvancements: await this.playerHasAdvancementService.count(),
      playerTypeHasAdvancements:
        await this.playerTypeHasAdvancementService.count(),
      playerTypeInTeamTypes: await this.playerTypeInTeamTypeService.count(),
      // TODO Count all (?) types of data
    };
  }
}
