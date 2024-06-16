import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { ApiClientService } from '../api-client/api-client.service';

export type BblCoachReference = {
  name: string;
};

// BBL has no more data points for coaches
export type BblCoach = BblCoachReference;

@Injectable()
export class CoachesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
  ) {}

  getCoaches(): BblCoach[] {
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

  async uploadCoaches(coaches: BblCoach[]): Promise<void> {
    for (const coach of coaches) {
      await this.uploadCoach(coach);
    }
  }

  private uploadedCoaches = Array<string>();
  async uploadCoach(coach: BblCoach): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedCoaches.indexOf(coach.name) != -1) {
      return;
    }
    this.uploadedCoaches.push(coach.name);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole coach
    // Upload the coach data
    const result = await this.api.post(
      'coach',
      {
        name: coach.name,
        externalIds: [this.api.externalId(coach.name)],
      },
    );
    console.log(JSON.stringify(result.data));
  }
}
