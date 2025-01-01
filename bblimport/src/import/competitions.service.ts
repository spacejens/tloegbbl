import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import {
  Competition,
  TeamReference,
  Trophy,
  TrophyAward,
  TrophyCategory,
} from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type CompetitionImportData = {
  competition: Competition;
  participants: TeamReference[];
  trophies: Trophy[];
  trophyAwards: TrophyAward[];
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
      const participantLookupByName: Map<string, string> = new Map<
        string,
        string
      >();
      const participantRows =
        competitionFile.querySelectorAll('table tr.trlist');
      for (const participantRow of participantRows) {
        const participantElements = participantRow.querySelectorAll('td');
        if (participantElements.length < 2) {
          throw new Error(
            `Unexpected number of participant elements in competition ${competitionId}`,
          );
        }
        const participantElement = participantElements[1];
        const teamId = this.fileReaderService.findTeamIdInGoToTeam(
          participantElement.getAttribute('onclick'),
        );
        const teamName = participantElement.rawText
          .replaceAll('&nbsp;', ' ')
          .trim();
        participants.push({
          externalIds: [this.apiUtils.externalId(teamId)],
        });
        participantLookupByName.set(teamName, teamId);
      }
      // Find competition results
      const competitionResultsFile = this.fileReaderService.readFile(
        `default.asp?p=sr&s=${competitionId}`,
      );
      const trophies: Trophy[] = [];
      const trophyAwards: TrophyAward[] = [];
      for (const trophyTable of competitionResultsFile.querySelectorAll(
        'table.tblist',
      )) {
        const trophyCategoryCells =
          trophyTable.querySelectorAll('tr.trlisthead th');
        if (trophyCategoryCells.length > 0) {
          // The trophy category is the same for the entire table
          const trophyCategoryText = trophyCategoryCells[0].rawText
            .replaceAll('&nbsp;', '')
            .trim();
          let trophyCategory: TrophyCategory;
          switch (trophyCategoryText) {
            case 'Team trophy':
              trophyCategory = TrophyCategory.TEAM_TROPHY;
              break;
            case 'Player prize':
              trophyCategory = TrophyCategory.PLAYER_TROPHY;
              break;
            default:
              throw new Error(
                `Unexpected trophy category "${trophyCategoryText}" for competition ${competitionId}`,
              );
          }
          // Each non-header row of the table is one awarded trophy
          const trophyRows = trophyTable.querySelectorAll('tr.trlist');
          if (trophyRows.length === 0) {
            throw new Error(
              `No ${trophyCategoryText} rows for competition ${competitionId}`,
            );
          }
          for (const trophyRow of trophyRows) {
            const trophyRowCells = trophyRow.querySelectorAll('td');
            if (
              (trophyCategory === TrophyCategory.TEAM_TROPHY &&
                trophyRowCells.length != 5) ||
              (trophyCategory === TrophyCategory.PLAYER_TROPHY &&
                trophyRowCells.length != 4)
            ) {
              throw new Error(
                `Unexpected number (${trophyRowCells.length}) of cells in ${trophyCategoryText} row for competition ${competitionId}`,
              );
            }
            const trophyName = trophyRowCells[1].rawText
              .replace('&nbsp;', '')
              .trim();
            const trophyId = trophyName; // TODO Is trophy name a good external ID? Is there a numeric ID? Maybe use icon URL?
            let teamId: string;
            let playerId: string;
            if (trophyCategory === TrophyCategory.TEAM_TROPHY) {
              teamId = this.fileReaderService.findQueryParamInOnclick(
                't',
                trophyRow.getAttribute('onclick'),
              );
            } else if (trophyCategory === TrophyCategory.PLAYER_TROPHY) {
              const trophyRowTeamNameElements =
                trophyRowCells[3].querySelectorAll('div');
              if (trophyRowTeamNameElements.length != 1) {
                throw new Error(
                  `Unexpected number (${trophyRowTeamNameElements}) of trophy row team name elements for competition ${competitionId}`,
                );
              }
              const trophyRowTeamName = trophyRowTeamNameElements[0].rawText;
              teamId = participantLookupByName.get(trophyRowTeamName);
              if (!teamId) {
                throw new Error(
                  `Failed to find team ID for team "${trophyRowTeamName}" in trophy row for competition ${competitionId}. Participant keys are ${Array.from(participantLookupByName.keys())}`,
                );
              }
              playerId = this.fileReaderService.findQueryParamInOnclick(
                'pid',
                trophyRow.getAttribute('onclick'),
              );
            } else {
              throw new Error(
                `Unexpected trophy category ${trophyCategory} for competition ${competitionId}`,
              );
            }
            trophies.push({
              externalIds: [this.apiUtils.externalId(trophyId)],
              name: trophyName,
              trophyCategory: trophyCategory,
            });
            trophyAwards.push({
              trophy: {
                externalIds: [this.apiUtils.externalId(trophyId)],
              },
              competition: {
                externalIds: [this.apiUtils.externalId(competitionId)],
              },
              team: {
                externalIds: [this.apiUtils.externalId(teamId)],
              },
              player: playerId
                ? {
                    externalIds: [this.apiUtils.externalId(playerId)],
                  }
                : undefined,
            });
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
        trophyAwards: trophyAwards,
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
    for (const trophyAward of data.trophyAwards) {
      const trophyAwardResult = await this.api.post(
        'trophy-award',
        trophyAward,
      );
      console.log(JSON.stringify(trophyAwardResult.data));
    }
  }
}
