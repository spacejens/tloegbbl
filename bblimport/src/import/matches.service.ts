import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblCompetitionReference } from './competitions.service';
import { BblTeamReference } from './teams.service';

export type BblMatchReference = {
  id: string;
};

export type BblMatch = BblMatchReference & {
  name: string;
  competition: BblCompetitionReference;
  teams: BblTeamReference[];
};

@Injectable()
export class MatchesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
  ) {}

  getMatches(): BblMatch[] {
    // Loop over all the match files in the directory
    const matches = Array<BblMatch>();
    const matchFilenames =
      this.fileReaderService.listFiles('default.asp?p=m&m=');
    for (const matchFilename of matchFilenames) {
      const matchId = matchFilename.slice(matchFilename.lastIndexOf('=') + 1);
      const matchFile = this.fileReaderService.readFile(matchFilename);
      // Find competition
      const competitionElements = matchFile.querySelectorAll('td div b a');
      if (competitionElements.length != 1) {
        throw new Error(
          `Did not expect to find ${competitionElements.length} competition elements for ${matchId}`,
        );
      }
      const competition = {
        id: this.fileReaderService.findQueryParamInHref(
          's',
          competitionElements[0].getAttribute('href'),
        ),
      };
      // Find match name
      const competitionAndMatchName =
        competitionElements[0].parentNode.innerText;
      const matchName = competitionAndMatchName.slice(
        competitionAndMatchName.indexOf(', ') + 2,
      );
      // Find teams
      const teamLogoElements = matchFile.querySelectorAll(
        'tr.trborder td a img',
      );
      if (teamLogoElements.length != 2) {
        // BBL doesn't support matches with more than two teams
        throw new Error(
          `Did not expect to find ${teamLogoElements.length} teams for ${matchId}`,
        );
      }
      const teams = Array<BblTeamReference>();
      for (const teamLogoElement of teamLogoElements) {
        teams.push({
          id: this.fileReaderService.findQueryParamInHref(
            't',
            teamLogoElement.parentNode.getAttribute('href'),
          ),
        });
      }
      // Assemble the result
      matches.push({
        id: matchId,
        name: matchName,
        competition: {
          id: competition.id,
        },
        teams: teams,
      });
    }
    return matches;
  }

  async uploadMatches(matches: BblMatch[]): Promise<void> {
    for (const match of matches) {
      await this.uploadMatch(match);
    }
  }

  async uploadMatch(match: BblMatch): Promise<void> {
    // Upload the match data
    const result = await this.api.mutation(
      'importMatch',
      'match',
      {
        name: match.name,
        externalIds: [this.api.externalId(match.id)],
        competition: {
          externalIds: [this.api.externalId(match.competition.id)],
        },
      },
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
        {
          competition: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
      ],
    );
    console.log(JSON.stringify(result.data));
    for (const team of match.teams) {
      const teamResult = await this.api.mutation(
        'importTeamInMatch',
        'teamInMatch',
        {
          team: {
            externalIds: [this.api.externalId(team.id)],
          },
          match: {
            externalIds: [this.api.externalId(match.id)],
          },
        },
        [
          'id',
          {
            team: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            match: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
        ],
      );
      console.log(JSON.stringify(teamResult.data));
    }
  }
}
