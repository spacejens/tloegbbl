import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerTypeService } from '../persistence/player-type.service';
import { PlayerTypeImportService } from '../import/player-type-import.service';
import { PlayerType } from '../dtos';

@Controller('player-type')
export class PlayerTypeController {
  constructor(
    private playerTypeService: PlayerTypeService,
    private playerTypeImportService: PlayerTypeImportService,
  ) {}

  @Post()
  async importPlayerType(@Body() playerType: PlayerType): Promise<PlayerType> {
    return this.playerTypeImportService.import(playerType);
  }

  @Get(':id')
  async getPlayerType(@Param('id') id: string): Promise<PlayerType> {
    return this.playerTypeService.findById(+id);
  }
}
