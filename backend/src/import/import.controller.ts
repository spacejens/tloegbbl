import { Body, Controller, Post } from '@nestjs/common';
import { ImportRequestEnvelope, ImportResponseEnvelope } from './envelopes';
import { CoachImportService } from './coach-import.service';
import { Coach } from '../dtos';

@Controller('import')
export class ImportController {
  constructor(private coachImportService: CoachImportService) {}

  @Post('coach')
  coach(
    @Body() request: ImportRequestEnvelope<Coach>,
  ): ImportResponseEnvelope<Coach> {
    return this.coachImportService.importCoach(request);
  }
}
