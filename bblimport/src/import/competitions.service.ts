import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FileReaderService } from './filereader.service';

export type BblCompetitionReference = {
  id: string;
};

export type BblCompetition = BblCompetitionReference & {
  name: string;
};

@Injectable()
export class CompetitionsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly httpService: HttpService,
  ) {}

  getCompetitions(): BblCompetition[] {
    // Loop over all the competition files in the directory
    const competitions = Array<BblCompetition>();
    const competitionFilenames = this.fileReaderService.listFiles(
      'default.asp?p=se&s=',
    );
    for (const competitionFilename of competitionFilenames) {
      const competitionId = competitionFilename.slice(
        competitionFilename.lastIndexOf('=') + 1,
      );
      const competitionFile =
        this.fileReaderService.readFile(competitionFilename);
      // Find competition name
      const competitionNameElements = competitionFile.querySelectorAll('h1');
      if (competitionNameElements.length != 1) {
        throw new Error(
          'Did not expect to find more than one competition name for ' +
            competitionId,
        );
      }
      const competitionName = competitionNameElements[0].innerText.slice(
        'Score for '.length,
      );
      // TODO Add participants of the competition
      competitions.push({
        id: competitionId,
        name: competitionName,
      });
    }
    return competitions;
  }

  async uploadCompetitions(competitions: BblCompetition[]): Promise<void> {
    for (const competition of competitions) {
      await this.uploadCompetition(competition);
    }
  }

  async uploadCompetition(competition: BblCompetition): Promise<void> {
    // Upload the competition data
    const externalId = competition.id;
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
              importCompetition(competition: {
                name:"${competition.name}",
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
