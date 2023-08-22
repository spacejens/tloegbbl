import { Injectable } from '@nestjs/common';

export type BblTeamTypeReference = {
  id: string;
};

export type BblTeamType = BblTeamTypeReference & {
  name: string;
};

@Injectable()
export class TeamTypesService {
  private uploadedTeamTypes = Array<string>();
  async uploadTeamType(teamType: BblTeamType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedTeamTypes.indexOf(teamType.id) != -1) {
      return;
    }
    this.uploadedTeamTypes.push(teamType.id);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole team type
    // TODO Upload team type to backend
    // TODO Console log the result from server
  }
}
