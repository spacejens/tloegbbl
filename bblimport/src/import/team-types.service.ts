import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type BblTeamTypeReference = {
  id: string;
};

export type BblTeamType = BblTeamTypeReference & {
  name: string;
};

@Injectable()
export class TeamTypesService {
  constructor(private readonly httpService: HttpService) {}

  private uploadedTeamTypes = Array<string>();
  async uploadTeamType(teamType: BblTeamType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedTeamTypes.indexOf(teamType.id) != -1) {
      return;
    }
    this.uploadedTeamTypes.push(teamType.id);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole team type
    // Upload the team type data
    const externalId = teamType.id;
    // TODO Get externalSystem from configuration
    const externalSystem = 'tloeg.bbleague.se';
    // TODO Use Axios variable substitution instead of assembling whole query string
    const result = await firstValueFrom(
      this.httpService.post(
        // TODO Get API URL from configuration
        'http://localhost:3000/api',
        {
          query: `
            mutation {
              importTeamType(teamType: {
                name:"${teamType.name}",
                externalIds:[
                  {
                    externalId:"${externalId}",
                    externalSystem:"${externalSystem}",
                  },
                ],
              }) {
                id,
                externalIds {
                  id,
                  externalId,
                  externalSystem,
                },
                name,
              }
            }
          `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    console.log(JSON.stringify(result.data));
  }
}
