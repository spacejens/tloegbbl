import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamTypeService } from '../persistence/team-type.service';
import { TeamTypeImportService } from '../import/team-type-import.service';
import { TeamType } from '../dtos';

@Controller('team-type')
export class TeamTypeController {
  constructor(
    private teamTypeService: TeamTypeService,
    private teamTypeImportService: TeamTypeImportService,
  ) {}

  @Post()
  async importTeamType(@Body() teamType: TeamType): Promise<TeamType> {
    return this.teamTypeImportService.import(teamType);
  }

  @Get(':id')
  async getTeamType(@Param('id') id: string): Promise<TeamType> {
    return this.teamTypeService.findById(+id);
  }
}
