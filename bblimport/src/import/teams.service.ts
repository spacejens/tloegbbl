import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';

export type BblTeamReference = {
    id: string;
}

// TODO Add more data points about each team
export type BblTeam = BblTeamReference & {
    name: string;
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
                // TODO Extract team data from team list row (coach, small logo filename)
                // TODO Extract more team data from team page (large logo filename, team type, trophies)
                teams.push({
                    id: teamId,
                    name: teamName,
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
