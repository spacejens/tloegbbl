import { Injectable } from '@nestjs/common';

export type BblTeamTypeReference = {
  id: string;
};

export type BblTeamType = BblTeamTypeReference & {
  name: string;
};

@Injectable()
export class TeamTypesService {
  async uploadTeamType(teamType: BblTeamType): Promise<void> {
    // TODO Ensure no duplicate uploads
    // TODO Upload team type to backend
    // TODO Console log the result from server
  }
}
