import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerTypeInTeamTypeService } from '../persistence/player-type-in-team-type.service';
import { PlayerTypeInTeamTypeImportService } from '../import/player-type-in-team-type-import.service';
import { PlayerTypeInTeamType } from '../dtos';

@Controller('player-type-in-team-type')
export class PlayerTypeInTeamTypeController {
  constructor(
    private playerTypeInTeamTypeService: PlayerTypeInTeamTypeService,
    private playerTypeInTeamTypeImportService: PlayerTypeInTeamTypeImportService,
  ) {}

  @Post()
  async importPlayerTypeInTeamType(
    @Body() playerTypeInTeamType: PlayerTypeInTeamType,
  ): Promise<PlayerTypeInTeamType> {
    return this.playerTypeInTeamTypeImportService.import(playerTypeInTeamType);
  }

  @Get(':id')
  async getPlayerTypeInTeamType(
    @Param('id') id: string,
  ): Promise<PlayerTypeInTeamType> {
    return this.playerTypeInTeamTypeService.findById(+id);
  }
}
