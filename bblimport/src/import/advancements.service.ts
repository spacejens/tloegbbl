import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { Advancement } from '../dtos';

@Injectable()
export class AdvancementsService {
  constructor(private readonly api: ApiClientService) {}

  private uploadedAdvancements = Array<string>();
  async uploadAdvancement(advancement: Advancement): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedAdvancements.indexOf(advancement.name) != -1) {
      return;
    }
    this.uploadedAdvancements.push(advancement.name);
    // Upload the team type data
    // TODO When uploading advancement, might need to ensure first letter is capitalized, and both forms are present as external IDs (loner/Loner)
    const result = await this.api.post('advancement', advancement);
    console.log(JSON.stringify(result.data));
  }
}
