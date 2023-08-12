import { Controller, Get } from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('count')
export class CountController {
  constructor(private readonly coachService: CoachService) {}

  @Get()
  async countEverything() {
    return {
      coaches: await this.coachService.countCoaches(),
      // TODO Count all (?) types of data
    };
  }
}
