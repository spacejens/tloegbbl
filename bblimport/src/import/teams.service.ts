import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';
import { BblCoachReference } from './coaches.service';

export type BblTeamReference = {
    id: string;
}

// TODO Add more data points about each team
export type BblTeam = BblTeamReference & {
    name: string;
    coaches: BblCoachReference[];
}

@Injectable()
export class TeamsService {
    constructor(private readonly fileReaderService: FileReaderService) {}

    getTeams(): BblTeam[] {
        const teams = Array<BblTeam>();
        const teamListFile = this.fileReaderService.readFile('default.asp?p=te');
        teamListFile.querySelectorAll('.tblist').forEach(teamList => {
            teamList.querySelectorAll('.trlist').forEach(teamRow => {
                const teamOnclick = teamRow.rawAttributes.onclick ?? teamRow.querySelectorAll('td')[1].rawAttributes.onclick;
                const teamId = this.fileReaderService.findQueryParamInOnclick('t', teamOnclick);
                const teamName = teamRow.querySelectorAll('td')[1].innerText;
                const teamCoaches = Array<BblCoachReference>();
                teamRow.querySelectorAll('td')[3].innerText.split('&').forEach(coach => {
                    teamCoaches.push({
                        name: coach.trim(),
                    });
                });
                // TODO Extract team data from team list row (small logo filename)
                // TODO Extract more team data from team page (large logo filename, team type, trophies)
                teams.push({
                    id: teamId,
                    name: teamName,
                    coaches: teamCoaches,
                });
            });
        });
        return teams;
    }

    uploadTeams(teams: BblTeam[]): void {
        // TODO Upload teams to backend
        console.log(teams);
    }
}
