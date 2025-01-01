import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrophyAwardService } from '../persistence/trophy-award.service';
import { TrophyAwardImportService } from '../import/trophy-award-import.service';
import { TrophyAward } from '../dtos';

@Controller('trophy-award')
export class TrophyAwardController {
  constructor(
    private trophyAwardService: TrophyAwardService,
    private trophyAwardImportService: TrophyAwardImportService,
  ) {}

  @Post()
  async importTrophyAward(
    @Body() trophyAward: TrophyAward,
  ): Promise<TrophyAward> {
    return this.trophyAwardImportService.import(trophyAward);
  }

  @Get(':id')
  async getTrophyAward(
    @Param('id') id: string,
  ): Promise<TrophyAward> {
    return this.trophyAwardService.findById(+id);
  }
}
