import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { Competition, TeamReference } from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type CompetitionImportData = {
  competition: Competition;
  participants: TeamReference[];
};

@Injectable()
export class CompetitionsService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  getCompetitions(): CompetitionImportData[] {
    // Loop over all the competition files in the directory
    const competitions = Array<CompetitionImportData>();
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
      // Find participants
      const participants = Array<TeamReference>();
      const participantElements = competitionFile.querySelectorAll(
        'table tr.trlist td.td9',
      );
      for (const participantElement of participantElements) {
        participants.push({
          externalIds: [
            this.apiUtils.externalId(
              this.fileReaderService.findTeamIdInGoToTeam(
                participantElement.getAttribute('onclick'),
              ),
            ),
          ],
        });
      }
      // Find competition results
      const competitionResultsFile =
        this.fileReaderService.readFile(`default.asp?p=sr&s=${competitionId}`);
      for (const trophyTable of competitionResultsFile.querySelectorAll('table.tblist')) {
        const trophyCategoryCells = trophyTable.querySelectorAll('tr.trlisthead th');
        if (trophyCategoryCells.length > 0) {
          const trophyCategory = trophyCategoryCells[0].rawText.replace(new RegExp('&nbsp;', 'g'),'').trim();
          switch (trophyCategory) {
            case 'Team trophy':
              // TODO Find team trophies
              break;
            case 'Player prize':
              // TODO Find player trophies
              break;
            default:
              throw new Error(`Unexpected trophy category "${trophyCategory}" for competition ${competitionId}`);
          }
        } else {
          // Not really a trophy category table, ignore
        }
      }
      // Assemble result
      competitions.push({
        competition: {
          externalIds: [this.apiUtils.externalId(competitionId)],
          name: competitionName,
        },
        participants: participants,
      });
    }
    return competitions;
  }

  async uploadCompetitions(
    competitions: CompetitionImportData[],
  ): Promise<void> {
    for (const competition of competitions) {
      await this.uploadCompetition(competition);
    }
  }

  async uploadCompetition(data: CompetitionImportData): Promise<void> {
    // Upload the competition data
    const result = await this.api.post('competition', data.competition);
    console.log(JSON.stringify(result.data));
    for (const participant of data.participants) {
      const participantResult = await this.api.post('team-in-competition', {
        team: participant,
        competition: data.competition,
      });
      console.log(JSON.stringify(participantResult.data));
    }
  }
}
