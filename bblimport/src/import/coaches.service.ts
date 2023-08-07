import { Injectable } from '@nestjs/common';
import { FileReaderService } from './filereader.service';

@Injectable()
export class CoachesService {
    constructor(private readonly fileReaderService: FileReaderService) {}

    // TODO Return array of specific data type instead
    getCoaches(): String[] {
        const coaches = new Set<String>();
        const teamListFile = this.fileReaderService.readFile('default.asp?p=te');
        teamListFile.querySelectorAll('.tblist').forEach(teamList => {
            teamList.querySelectorAll('.trlist').forEach(teamRow => {
                const coachColumnText = teamRow.querySelectorAll('td')[3].innerText;
                coachColumnText.split('&').forEach(coach => {
                    coaches.add(coach.trim());
                });
            });
        });
        return [...coaches].sort();
    }
}
