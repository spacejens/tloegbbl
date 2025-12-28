import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { TeamType } from '@tloegbbl/api';

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
    // Upload the team type data
    const result = await this.api.post('team-type', teamType);
    console.log(JSON.stringify(result.data));
  }
}
