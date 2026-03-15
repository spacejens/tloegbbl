import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoachService } from '../persistence/coach.service';
import { CoachImportService } from '../import/coach-import.service';
import { Coach } from '@tloegbbl/api';

@Controller('coach')
export class CoachController {
  constructor(
    private coachService: CoachService,
    private coachImportService: CoachImportService,
  ) {}

  @Post()
  async importCoach(@Body() coach: Coach): Promise<Coach> {
    return this.coachImportService.import(coach);
  }

  @Get(':id')
  async getCoach(@Param('id') id: string): Promise<Coach> {
    return this.coachService.findById(+id);
  }
}
