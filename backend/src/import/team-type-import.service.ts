import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { TeamType } from '../dtos';
import { TeamTypeService } from '../persistence/team-type.service';
import { ImportService } from './import.service';

@Injectable()
export class TeamTypeImportService extends ImportService<TeamType> {
  constructor(
    private readonly teamTypeService: TeamTypeService,
    private readonly combineDataService: CombineDataService,
  ) {
    super();
  }

  async import(requested: TeamType): Promise<TeamType> {
    const found: TeamType =
      await this.teamTypeService.findByReference(requested);
    if (found) {
      return await this.teamTypeService.update(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.teamTypeService.create(requested);
    }
  }
}
