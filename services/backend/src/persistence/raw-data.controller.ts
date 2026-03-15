import { Controller, Get } from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('rawdata')
export class RawDataController {
  constructor(private readonly coachService: CoachService) {}

  @Get()
  async coaches() {
    // TODO Return list of all coaches instead of this temporary test
    return {
      byId: await this.coachService.findById(2),
      byExternalId: await this.coachService.findByExternalId({
        externalId: 'Foo',
        externalSystem: 'TestSystem',
      }),
      byReferenceId: await this.coachService.findByReference({
        id: 2,
      }),
      byReferenceExternalId: await this.coachService.findByReference({
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
