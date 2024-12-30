import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { Competition, TeamReference, Trophy, TrophyCategory } from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type CompetitionImportData = {
  competition: Competition;
  participants: TeamReference[];
  trophies: Trophy[];
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
      const trophies: Trophy[] = [];
      for (const trophyTable of competitionResultsFile.querySelectorAll('table.tblist')) {
        const trophyCategoryCells = trophyTable.querySelectorAll('tr.trlisthead th');
        if (trophyCategoryCells.length > 0) {
          // The trophy category is the same for the entire table
          const trophyCategoryText = trophyCategoryCells[0].rawText.replace(new RegExp('&nbsp;', 'g'),'').trim();
          let trophyCategory: TrophyCategory;
          switch (trophyCategoryText) {
            case 'Team trophy':
              trophyCategory = TrophyCategory.TEAM_TROPHY;
              break;
            case 'Player prize':
              trophyCategory = TrophyCategory.PLAYER_TROPHY;
              break;
            default:
              throw new Error(`Unexpected trophy category "${trophyCategoryText}" for competition ${competitionId}`);
          }
          // Each non-header row of the table is one awarded trophy
          const trophyRows = trophyTable.querySelectorAll('tr.trlist');
          if (trophyRows.length === 0) {
            throw new Error(`No ${trophyCategoryText} rows for competition ${competitionId}`);
          }
          for (const trophyRow of trophyRows) {
            const trophyRowCells = trophyRow.querySelectorAll('td');
            if ((trophyCategory === TrophyCategory.TEAM_TROPHY && trophyRowCells.length != 5)
              || (trophyCategory === TrophyCategory.PLAYER_TROPHY && trophyRowCells.length != 4)) {
              throw new Error(`Unexpected number (${trophyRowCells.length}) of cells in ${trophyCategoryText} row for competition ${competitionId}`);
            }
            const trophyName = trophyRowCells[1].rawText.replace('&nbsp;', '').trim();
            const trophyId = trophyName; // TODO Is trophy name a good external ID? Is there a numeric ID? Maybe use icon URL?
            // TODO Find team of trophy (different for team and player trophies)
            // TODO Find player of trophy (only for player trophies)
            trophies.push({
              externalIds: [this.apiUtils.externalId(trophyId)],
              name: trophyName,
              trophyCategory: trophyCategory,
            });
            // TODO Add all related awarded data (team, competition, player) to pushed trophy
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
        trophies: trophies,
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
    for (const trophy of data.trophies) {
      const trophyResult = await this.api.post('trophy', trophy);
      console.log(JSON.stringify(trophyResult.data));
    }
    // TODO Upload trophy awarded data
  }
}
