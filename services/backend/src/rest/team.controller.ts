import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamService } from '../persistence/team.service';
import { TeamImportService } from '../import/team-import.service';
import { Team } from '@tloegbbl/api';

@Controller('team')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private teamImportService: TeamImportService,
  ) {}

  @Post()
  async importTeam(@Body() team: Team): Promise<Team> {
    return this.teamImportService.import(team);
  }

  @Get(':id')
  async getTeam(@Param('id') id: string): Promise<Team> {
    return this.teamService.findById(+id);
  }
}
