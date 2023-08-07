import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';

export type BblCoach = {
    name: string;
}

@Injectable()
export class CoachesService {
    constructor(private readonly fileReaderService: FileReaderService) {}

    getCoaches(): BblCoach[] {
        const coaches = new Set<string>();
        const teamListFile = this.fileReaderService.readFile('default.asp?p=te');
        teamListFile.querySelectorAll('.tblist').forEach(teamList => {
            teamList.querySelectorAll('.trlist').forEach(teamRow => {
                const coachColumnText = teamRow.querySelectorAll('td')[3].innerText;
                coachColumnText.split('&').forEach(coach => {
                    coaches.add(coach.trim());
                });
            });
        });
        return [...coaches].sort().map(coach => ({
            name: coach,
        }));
    }
}
