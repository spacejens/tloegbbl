import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';

export type BblAdvancementReference = {
  name: string;
};

// BBL has no more data points for advancements
export type BblAdvancement = BblAdvancementReference;

@Injectable()
export class AdvancementsService {
  constructor(private readonly api: ApiClientService) {}

  private uploadedAdvancements = Array<string>();
  async uploadAdvancement(advancement: BblAdvancement): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedAdvancements.indexOf(advancement.name) != -1) {
      return;
    }
    this.uploadedAdvancements.push(advancement.name);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole advancement
    // Upload the team type data
    const result = await this.api.post(
      'advancement',
      {
        name: advancement.name,
        // TODO When uploading advancement, might need to ensure first letter is capitalized, and both forms are present as external IDs (loner/Loner)
        externalIds: [this.api.externalId(advancement.name)],
      },
    );
    console.log(JSON.stringify(result.data));
  }
}
