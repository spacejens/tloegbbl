import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { TrophyService } from '../persistence/trophy.service';
import { TrophyImportService } from '../import/trophy-import.service';
import { Trophy } from '../dtos';
import { TrophyPipe } from './trophy.pipe';

@Controller('trophy')
export class TrophyController {
  constructor(
    private trophyService: TrophyService,
    private trophyImportService: TrophyImportService,
  ) {}

  @Post()
  @UsePipes(TrophyPipe)
  async importTrophy(@Body() trophy: Trophy): Promise<Trophy> {
    return this.trophyImportService.import(trophy);
  }

  @Get(':id')
  async getTrophy(@Param('id') id: string): Promise<Trophy> {
    return this.trophyService.findById(+id);
  }
}
