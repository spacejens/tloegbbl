import { Injectable } from '@nestjs/common';
import { TeamService } from '../persistence/team.service';
import { CombineDataService } from './combine-data.service';
import { Team } from '../dtos';

@Injectable()
export class TeamImportService {
  constructor(
    private readonly teamService: TeamService,
    private readonly combineDataService: CombineDataService,
  ) {}

  async import(requested: Team): Promise<Team> {
    const found: Team = await this.teamService.findByReference(requested);
    if (found) {
      return await this.teamService.update(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.teamService.create(requested);
    }
  }
}
