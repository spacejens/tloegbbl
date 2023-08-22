import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { TeamType } from '../dtos';
import { TeamTypeService } from '../persistence/team-type.service';

@Injectable()
export class TeamTypeImportService {
  constructor(
    private readonly teamTypeService: TeamTypeService,
    private readonly combineDataService: CombineDataService,
  ) {}

  async import(requested: TeamType): Promise<TeamType> {
    const found: TeamType =
      await this.teamTypeService.findTeamTypeByReference(requested);
    if (found) {
      return await this.teamTypeService.updateTeamType(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.teamTypeService.createTeamType(requested);
    }
  }
}
