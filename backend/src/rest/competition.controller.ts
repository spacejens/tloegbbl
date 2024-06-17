import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompetitionService } from '../persistence/competition.service';
import { CompetitionImportService } from '../import/competition-import.service';
import { Competition } from '../dtos';

@Controller('competition')
export class CompetitionController {
  constructor(
    private competitionService: CompetitionService,
    private competitionImportService: CompetitionImportService,
  ) {}

  @Post()
  async importCompetition(@Body() competition: Competition): Promise<Competition> {
    return this.competitionImportService.import(competition);
  }

  @Get(':id')
  async getCompetition(@Param('id') id: string): Promise<Competition> {
    return this.competitionService.findById(+id);
  }
}
