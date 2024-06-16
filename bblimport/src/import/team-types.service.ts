import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';

export type BblTeamTypeReference = {
  id: string;
};

export type BblTeamType = BblTeamTypeReference & {
  name: string;
};

@Injectable()
export class TeamTypesService {
  constructor(private readonly api: ApiClientService) {}

  private uploadedTeamTypes = Array<string>();
  async uploadTeamType(teamType: BblTeamType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedTeamTypes.indexOf(teamType.id) != -1) {
      return;
    }
    this.uploadedTeamTypes.push(teamType.id);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole team type
    // Upload the team type data
    const result = await this.api.post(
      'team-type',
      {
        name: teamType.name,
        externalIds: [this.api.externalId(teamType.id)],
      },
    );
    console.log(JSON.stringify(result.data));
  }
}
