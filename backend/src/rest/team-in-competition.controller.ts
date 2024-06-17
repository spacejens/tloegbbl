import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamInCompetitionService } from '../persistence/team-in-competition.service';
import { TeamInCompetitionImportService } from '../import/team-in-competition-import.service';
import { TeamInCompetition } from '../dtos';

@Controller('team-in-competition')
export class TeamInCompetitionController {
  constructor(
    private teamInCompetitionService: TeamInCompetitionService,
    private teamInCompetitionImportService: TeamInCompetitionImportService,
  ) {}

  @Post()
  async importCompetition(@Body() teamInCompetition: TeamInCompetition): Promise<TeamInCompetition> {
    return this.teamInCompetitionImportService.import(teamInCompetition);
  }

  @Get(':id')
  async getCompetition(@Param('id') id: string): Promise<TeamInCompetition> {
    return this.teamInCompetitionService.findById(+id);
  }
}
