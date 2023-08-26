import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';

export type BblPlayerTypeReference = {
  id: string;
};

export type BblPlayerType = BblPlayerTypeReference & {
  name: string;
};

@Injectable()
export class PlayerTypesService {
  constructor(private readonly api: ApiClientService) {}

  private uploadedPlayerTypes = Array<string>();
  async uploadPlayerType(playerType: BblPlayerType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedPlayerTypes.indexOf(playerType.id) != -1) {
      return;
    }
    this.uploadedPlayerTypes.push(playerType.id);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole player type
    // Upload the player type data
    const result = await this.api.mutation(
      'importPlayerType',
      'playerType',
      {
        name: playerType.name,
        externalIds: [this.api.externalId(playerType.id)],
      },
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
      ],
    );
    console.log(JSON.stringify(result.data));
  }
}
