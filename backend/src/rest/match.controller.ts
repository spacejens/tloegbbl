import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchService } from '../persistence/match.service';
import { MatchImportService } from '../import/match-import.service';
import { Match } from '../dtos';

@Controller('match')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private matchImportService: MatchImportService,
  ) {}

  @Post()
  async importMatch(@Body() match: Match): Promise<Match> {
    return this.matchImportService.import(match);
  }

  @Get(':id')
  async getMatch(@Param('id') id: string): Promise<Match> {
    return this.matchService.findById(+id);
  }
}
