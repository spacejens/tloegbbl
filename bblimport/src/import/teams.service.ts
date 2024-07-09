import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { BblTeamType, TeamTypesService } from './team-types.service';
import { ApiClientService } from '../api-client/api-client.service';
import { Coach, CoachReference } from '../dtos';

export type BblTeamReference = {
  id: string;
};

// TODO Add more data points about each team
export type BblTeam = BblTeamReference & {
  name: string;
  extraId?: string;
  headCoach: CoachReference;
  coCoach?: CoachReference;
  teamType: BblTeamType;
};

// TODO Perhaps avoid gathering all data at once and passing it around, to reduce memory cost?
export type TeamImportData = {
  team: BblTeam,
  headCoach: Coach,
  coCoach?: Coach,
  teamType: BblTeamType,
};

@Injectable()
export class TeamsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly coachesService: CoachesService,
    private readonly teamTypesService: TeamTypesService,
    private readonly api: ApiClientService,
  ) {}

  getTeams(): TeamImportData[] {
    // Loop over all team files in the directory
    const teams = Array<TeamImportData>();
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
      // Find extra team ID (if different in links due to character encoding issues)
      const teamSelfLinkElements =
        teamViewFile.querySelectorAll('td a.opacity');
      if (teamSelfLinkElements.length != 2) {
        throw new Error(
          `Did not expect to find ${teamSelfLinkElements.length} self links on team page for ${teamId}`,
        );
      }
      let extraId: string = this.fileReaderService.findQueryParamInHref(
        't',
        teamSelfLinkElements[0].getAttribute('href'),
      );
      if (teamId === extraId) {
        extraId = undefined;
      }
      // Find head coach and co-coaches (if present)
      const coachElements = teamViewFile.querySelectorAll('td b span');
      if (coachElements.length === 1) {
        teams.push({
          team: {
            id: teamId,
            extraId: extraId,
            name: teamName,
            headCoach: {
              externalIds: [this.api.externalId(coachElements[0].innerText)],
            },
            teamType: teamType,
          },
          headCoach: {
            externalIds: [this.api.externalId(coachElements[0].innerText)],
            name: coachElements[0].innerText,
          },
          teamType: teamType,
        });
      } else if (coachElements.length === 2) {
        // TODO Merge one/many coaches cases into a single case to avoid code duplication
        teams.push({
          team: {
            id: teamId,
            extraId: extraId,
            name: teamName,
            headCoach: {
              externalIds: [this.api.externalId(coachElements[0].innerText)],
            },
            coCoach: {
              externalIds: [this.api.externalId(coachElements[1].innerText)],
            },
            teamType: teamType,
          },
          headCoach: {
            externalIds: [this.api.externalId(coachElements[0].innerText)],
            name: coachElements[0].innerText,
          },
          coCoach: {
            externalIds: [this.api.externalId(coachElements[1].innerText)],
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

  async uploadTeams(teams: TeamImportData[]): Promise<void> {
    for (const team of teams) {
      await this.uploadTeam(team);
    }
  }

  async uploadTeam(data: TeamImportData): Promise<void> {
    await this.coachesService.uploadCoach(data.headCoach);
    if (data.coCoach) {
      await this.coachesService.uploadCoach(data.coCoach);
    }
    await this.teamTypesService.uploadTeamType(data.teamType);
    // Upload the team data
    const result = await this.api.post(
      'team',
      {
        name: data.team.name,
        externalIds: data.team.extraId ? [
          this.api.externalId(data.team.id),
          this.api.externalId(data.team.extraId),
        ] : [
          this.api.externalId(data.team.id),
        ],
        headCoach: data.team.headCoach,
        coCoach: data.team.coCoach,
        teamType: {
          externalIds: [this.api.externalId(data.team.teamType.id)],
        },
      },
    );
    console.log(JSON.stringify(result.data));
  }
}
