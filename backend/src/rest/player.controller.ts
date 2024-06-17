import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerService } from '../persistence/player.service';
import { PlayerImportService } from '../import/player-import.service';
import { Player } from '../dtos';

@Controller('player')
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private playerImportService: PlayerImportService,
  ) {}

  @Post()
  async importPlayer(@Body() player: Player): Promise<Player> {
    return this.playerImportService.import(player);
  }

  @Get(':id')
  async getPlayer(@Param('id') id: string): Promise<Player> {
    return this.playerService.findById(+id);
  }
}
