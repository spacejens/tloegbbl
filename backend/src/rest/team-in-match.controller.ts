import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamInMatchService } from '../persistence/team-in-match.service';
import { TeamInMatchImportService } from '../import/team-in-match-import.service';
import { TeamInMatch } from '../dtos';

@Controller('team-in-match')
export class TeamInMatchController {
  constructor(
    private teamInMatchService: TeamInMatchService,
    private teamInMatchImportService: TeamInMatchImportService,
  ) {}

  @Post()
  async importTeamInMatch(@Body() teamInMatch: TeamInMatch): Promise<TeamInMatch> {
    return this.teamInMatchImportService.import(teamInMatch);
  }

  @Get(':id')
  async getTeamInMatch(@Param('id') id: string): Promise<TeamInMatch> {
    return this.teamInMatchService.findById(+id);
  }
}
