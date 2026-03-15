import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerHasAdvancementService } from '../persistence/player-has-advancement.service';
import { PlayerHasAdvancementImportService } from '../import/player-has-advancement-import.service';
import { PlayerHasAdvancement } from '@tloegbbl/api';

@Controller('player-has-advancement')
export class PlayerHasAdvancementController {
  constructor(
    private playerHasAdvancementService: PlayerHasAdvancementService,
    private playerHasAdvancementImportService: PlayerHasAdvancementImportService,
  ) {}

  @Post()
  async importPlayerHasAdvancement(
    @Body() playerHasAdvancement: PlayerHasAdvancement,
  ): Promise<PlayerHasAdvancement> {
    return this.playerHasAdvancementImportService.import(playerHasAdvancement);
  }

  @Get(':id')
  async getPlayerHasAdvancement(
    @Param('id') id: string,
  ): Promise<PlayerHasAdvancement> {
    return this.playerHasAdvancementService.findById(+id);
  }
}
