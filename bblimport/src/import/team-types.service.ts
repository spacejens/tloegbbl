import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { TeamType } from '../dtos';

@Injectable()
export class TeamTypesService {
  constructor(private readonly api: ApiClientService) {}

  private uploadedTeamTypes = Array<string>();
  async uploadTeamType(teamType: TeamType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedTeamTypes.indexOf(teamType.name) != -1) {
      return;
    }
    this.uploadedTeamTypes.push(teamType.name);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole team type
    // Upload the team type data
    const result = await this.api.post(
      'team-type',
      teamType,
    );
    console.log(JSON.stringify(result.data));
  }
}
