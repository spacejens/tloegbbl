import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchEventService } from '../persistence/match-event.service';
import { MatchEventImportService } from '../import/match-event-import.service';
import { MatchEvent } from '../dtos';

@Controller('match-event')
export class MatchEventController {
  constructor(
    private matchEventService: MatchEventService,
    private matchEventImportService: MatchEventImportService,
  ) {}

  @Post()
  async importMatchEvent(@Body() matchEvent: MatchEvent): Promise<MatchEvent> {
    return this.matchEventImportService.import(matchEvent);
  }

  @Get(':id')
  async getMatchEvent(@Param('id') id: string): Promise<MatchEvent> {
    return this.matchEventService.findById(+id);
  }
}
