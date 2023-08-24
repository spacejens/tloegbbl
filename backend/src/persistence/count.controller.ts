import { Controller, Get } from '@nestjs/common';
import { CoachService } from './coach.service';
import { TeamTypeService } from './team-type.service';
import { TeamService } from './team.service';
import { CompetitionService } from './competition.service';

@Controller('count')
export class CountController {
  constructor(
    private readonly coachService: CoachService,
    private readonly teamTypeService: TeamTypeService,
    private readonly teamService: TeamService,
    private readonly competitionService: CompetitionService,
  ) {}

  @Get()
  async countEverything() {
    return {
      coaches: await this.coachService.count(),
      teamTypes: await this.teamTypeService.count(),
      teams: await this.teamService.count(),
      competitions: await this.competitionService.count(),
      // TODO Count all (?) types of data
    };
  }
}
