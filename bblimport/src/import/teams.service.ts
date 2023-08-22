import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { BblCoachReference, CoachesService } from './coaches.service';

export type BblTeamReference = {
  id: string;
};

// TODO Add more data points about each team
export type BblTeam = BblTeamReference & {
  name: string;
  headCoach: BblCoachReference;
  coCoach?: BblCoachReference;
};

@Injectable()
export class TeamsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly coachesService: CoachesService,
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
      // Find head coach and co-coaches (if present)
      const coachElements = teamViewFile.querySelectorAll('td b span');
      if (coachElements.length === 1) {
        teams.push({
          id: teamId,
          name: teamName,
          headCoach: {
            name: coachElements[0].innerText,
          },
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
    console.log(teams); // TODO Remove debug printout
  }

  async uploadTeam(team: BblTeam): Promise<void> {
    await this.coachesService.uploadCoach(team.headCoach);
    if (team.coCoach) {
      await this.coachesService.uploadCoach(team.coCoach);
    }
    // TODO Ensure team type is uploaded to backend
    // TODO Upload team itself to backend
  }
}
