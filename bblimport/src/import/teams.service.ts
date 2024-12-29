import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { CoachesService } from './coaches.service';
import { TeamTypesService } from './team-types.service';
import { ApiClientService } from '../api-client/api-client.service';
import { Coach, ExternalId, Team, TeamType } from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type TeamImportData = {
  team: Team;
  headCoach: Coach;
  coCoach?: Coach;
  teamType: TeamType;
};

@Injectable()
export class TeamsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly coachesService: CoachesService,
    private readonly teamTypesService: TeamTypesService,
    private readonly api: ApiClientService,
    private readonly apiUtils: ApiUtilsService,
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
      const teamType: TeamType = {
        externalIds: [
          this.apiUtils.externalId(
            this.fileReaderService.findAnchorInHref(
              teamTypeElements[0].getAttribute('href'),
            ),
          ),
        ],
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
      const externalIds: ExternalId[] = [this.apiUtils.externalId(teamId)];
      if (extraId) {
        externalIds.push(this.apiUtils.externalId(extraId));
      }
      // Find head coach and co-coaches (if present)
      const coachElements = teamViewFile.querySelectorAll('td b span');
      if (coachElements.length === 1 || coachElements.length === 2) {
        teams.push({
          team: {
            externalIds: externalIds,
            name: teamName,
            headCoach: {
              externalIds: [this.apiUtils.externalId(coachElements[0].innerText)],
            },
            coCoach: coachElements.length === 1 ? undefined : {
              externalIds: [this.apiUtils.externalId(coachElements[1].innerText)],
            },
            teamType: teamType,
          },
          headCoach: {
            externalIds: [this.apiUtils.externalId(coachElements[0].innerText)],
            name: coachElements[0].innerText,
          },
          coCoach: coachElements.length === 1 ? undefined : {
            externalIds: [this.apiUtils.externalId(coachElements[1].innerText)],
            name: coachElements[1].innerText,
          },
          teamType: teamType,
        });
      } else {
        throw new Error('Failed to find coach for ' + teamId);
      }
      // TODO Extract team data from team list row (small logo filename)
      // TODO Extract more team data from team page (large logo filename, team type)
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
    const result = await this.api.post('team', data.team);
    console.log(JSON.stringify(result.data));
  }
}
