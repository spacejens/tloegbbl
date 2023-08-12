import { Body, Controller, Post } from '@nestjs/common';
import {
  ImportCoach,
  ImportRequestEnvelope,
  ImportResponseEnvelope,
} from './import.interface';
import { CoachImportService } from './coach-import.service';

@Controller('import')
export class ImportController {
  constructor(private coachImportService: CoachImportService) {}

  @Post('coach')
  coach(
    @Body() request: ImportRequestEnvelope<ImportCoach>,
  ): ImportResponseEnvelope<ImportCoach> {
    return this.coachImportService.importCoach(request);
  }
}
