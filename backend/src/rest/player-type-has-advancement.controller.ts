import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerTypeHasAdvancementService } from '../persistence/player-type-has-advancement.service';
import { PlayerTypeHasAdvancementImportService } from '../import/player-type-has-advancement-import.service';
import { PlayerTypeHasAdvancement } from '@tloegbbl/api';

@Controller('player-type-has-advancement')
export class PlayerTypeHasAdvancementController {
  constructor(
    private playerTypeHasAdvancementService: PlayerTypeHasAdvancementService,
    private playerTypeHasAdvancementImportService: PlayerTypeHasAdvancementImportService,
  ) {}

  @Post()
  async importPlayerTypeHasAdvancement(
    @Body() playerTypeHasAdvancement: PlayerTypeHasAdvancement,
  ): Promise<PlayerTypeHasAdvancement> {
    return this.playerTypeHasAdvancementImportService.import(
      playerTypeHasAdvancement,
    );
  }

  @Get(':id')
  async getPlayerTypeHasAdvancement(
    @Param('id') id: string,
  ): Promise<PlayerTypeHasAdvancement> {
    return this.playerTypeHasAdvancementService.findById(+id);
  }
}
