import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { ApiClientService } from '../api-client/api-client.service';
import { Coach } from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

@Injectable()
export class CoachesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  getCoaches(): Coach[] {
    const coaches = new Set<string>();
    const teamListFile = this.fileReaderService.readFile('default.asp?p=te');
    teamListFile.querySelectorAll('.tblist').forEach((teamList) => {
      teamList.querySelectorAll('.trlist').forEach((teamRow) => {
        const coachColumnText = teamRow.querySelectorAll('td')[3].innerText;
        coachColumnText.split('&').forEach((coach) => {
          coaches.add(coach.trim());
        });
      });
    });
    return [...coaches].sort().map((coach) => ({
      name: coach,
    }));
  }

  async uploadCoaches(coaches: Coach[]): Promise<void> {
    for (const coach of coaches) {
      await this.uploadCoach(coach);
    }
  }

  private uploadedCoaches = Array<string>();
  async uploadCoach(coach: Coach): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedCoaches.indexOf(coach.name) != -1) {
      return;
    }
    this.uploadedCoaches.push(coach.name);
    // Upload the coach data
    const result = await this.api.post('coach', {
      name: coach.name,
      externalIds: [this.apiUtils.externalId(coach.name)],
    });
    console.log(JSON.stringify(result.data));
  }
}
