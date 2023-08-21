import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type BblCoachReference = {
  name: string;
};

// BBL has no more data points for coaches
export type BblCoach = BblCoachReference;

@Injectable()
export class CoachesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly httpService: HttpService,
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
      const externalId = coach.name;
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
                importCoach(coach: {
                  name:"${coach.name}",
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
      console.log(JSON.stringify(result.data)); // TODO Remove the debug printout
    }
  }
}
