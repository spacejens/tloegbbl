import { Controller, Get } from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('rawdata')
export class RawDataController {
  constructor(private readonly coachService: CoachService) {}

  @Get()
  async coaches() {
    // TODO Return list of all coaches instead of this temporary test
    return {
      byId: this.coachService.findCoachById(2),
      byExternalId: this.coachService.findCoachByExternalId({
        externalId: 'Foo',
        externalSystem: 'TestSystem',
      }),
      byReferenceId: this.coachService.findCoachByReference({
        id: 2,
      }),
      byReferenceExternalId: this.coachService.findCoachByReference({
        externalIds: [
          {
            externalId: 'Foo',
            externalSystem: 'TestSystem',
          },
        ],
      }),
    };
  }
}