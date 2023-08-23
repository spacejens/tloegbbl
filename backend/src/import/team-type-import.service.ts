import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { TeamType, TeamTypeReference } from '../dtos';
import { TeamTypeService } from '../persistence/team-type.service';
import { ImportService } from './import.service';

@Injectable()
export class TeamTypeImportService extends ImportService<TeamTypeReference, TeamType> {
  constructor(
    readonly persistenceService: TeamTypeService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }

  async import(requested: TeamType): Promise<TeamType> {
    const found: TeamType =
      await this.persistenceService.findByReference(requested);
    if (found) {
      return await this.persistenceService.update(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.persistenceService.create(requested);
    }
  }
}
