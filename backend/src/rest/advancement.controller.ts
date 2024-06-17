import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdvancementService } from '../persistence/advancement.service';
import { AdvancementImportService } from '../import/advancement-import.service';
import { Advancement } from '../dtos';

@Controller('advancement')
export class AdvancementController {
  constructor(
    private advancementService: AdvancementService,
    private advancementImportService: AdvancementImportService,
  ) {}

  @Post()
  async importAdvancement(@Body() advancement: Advancement): Promise<Advancement> {
    return this.advancementImportService.import(advancement);
  }

  @Get(':id')
  async getAdvancement(@Param('id') id: string): Promise<Advancement> {
    return this.advancementService.findById(+id);
  }
}
