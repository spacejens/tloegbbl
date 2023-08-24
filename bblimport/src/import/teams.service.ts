import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { BblCoachReference, CoachesService } from './coaches.service';
import { BblTeamType, TeamTypesService } from './team-types.service';
import { ApiClientService } from '../api-client/api-client.service';

export type BblTeamReference = {
  id: string;
};

// TODO Add more data points about each team
export type BblTeam = BblTeamReference & {
  name: string;
  headCoach: BblCoachReference;
  coCoach?: BblCoachReference;
  teamType: BblTeamType;
};

@Injectable()
export class TeamsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly coachesService: CoachesService,
    private readonly teamTypesService: TeamTypesService,
    private readonly api: ApiClientService,
  ) {}

  getTeams(): BblTeam[] {
    // Loop over all team files in the directory
    const teams = Array<BblTeam>();
    const teamViewFilenames = this.fileReaderService.listFiles(
      'default.asp?p=tm&t=',
    );
    for (const teamViewFilename of teamViewFilenames) {
      const teamId = teamViewFilename.slice(
        teamViewFilename.lastIndexOf('=') + 1,
      );
      const teamViewFile = this.fileReaderService.readFile(teamViewFilename);
      // Find team name
      const teamNameElements = teamViewFile.querySelectorAll('h1');
      if (teamNameElements.length != 1) {
        throw new Error(
          'Did not expect to find more than one team name for ' + teamId,
        );
      }
      const teamName = teamNameElements[0].innerText;
      // Find team type
      const teamTypeElements = teamViewFile.querySelectorAll('td b a');
      if (teamTypeElements.length != 1) {
        throw new Error(
          'Did not expect to find more than one team type for ' + teamId,
        );
      }
      const teamType: BblTeamType = {
        id: this.fileReaderService.findAnchorInHref(
          teamTypeElements[0].getAttribute('href'),
        ),
        name: teamTypeElements[0].innerText,
      };
      // Find head coach and co-coaches (if present)
      const coachElements = teamViewFile.querySelectorAll('td b span');
      if (coachElements.length === 1) {
        teams.push({
          id: teamId,
          name: teamName,
          headCoach: {
            name: coachElements[0].innerText,
          },
          teamType: teamType,
        });
      } else if (coachElements.length === 2) {
        // TODO Merge one/many coaches cases into a single case to avoid code duplication
        teams.push({
          id: teamId,
          name: teamName,
          headCoach: {
            name: coachElements[0].innerText,
          },
          coCoach: {
            name: coachElements[1].innerText,
          },
          teamType: teamType,
        });
      } else {
        throw new Error('Failed to find coach for ' + teamId);
      }
      // TODO Extract team data from team list row (small logo filename)
      // TODO Extract more team data from team page (large logo filename, team type, trophies)
    }
    return teams;
  }

  async uploadTeams(teams: BblTeam[]): Promise<void> {
    for (const team of teams) {
      await this.uploadTeam(team);
    }
  }

  async uploadTeam(team: BblTeam): Promise<void> {
    await this.coachesService.uploadCoach(team.headCoach);
    if (team.coCoach) {
      await this.coachesService.uploadCoach(team.coCoach);
    }
    await this.teamTypesService.uploadTeamType(team.teamType);
    // Upload the team data
    const result = await this.api.mutation(
      'importTeam',
      'team',
      {
        name: team.name,
        externalIds: [this.api.externalId(team.id)],
        headCoach: {
          externalIds: [this.api.externalId(team.headCoach.name)],
        },
        coCoach: team.coCoach
          ? {
              externalIds: [this.api.externalId(team.coCoach.name)],
            }
          : undefined,
        teamType: {
          externalIds: [this.api.externalId(team.teamType.id)],
        },
      },
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
        {
          headCoach: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
        {
          coCoach: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
        {
          teamType: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
      ],
    );
    console.log(JSON.stringify(result.data));
  }
}
