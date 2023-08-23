import { Injectable } from '@nestjs/common';
import { TeamService } from '../persistence/team.service';
import { CombineDataService } from './combine-data.service';
import { Team, TeamReference } from '../dtos';
import { ImportService } from './import.service';

@Injectable()
export class TeamImportService extends ImportService<TeamReference, Team> {
  constructor(
    readonly persistenceService: TeamService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }

  async import(requested: Team): Promise<Team> {
    const found: Team = await this.persistenceService.findByReference(requested);
    if (found) {
      return await this.persistenceService.update(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.persistenceService.create(requested);
    }
  }
}
