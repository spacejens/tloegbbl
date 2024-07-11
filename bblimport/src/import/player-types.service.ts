import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { AdvancementsService } from './advancements.service';
import { TeamTypesService } from './team-types.service';
import { Advancement, PlayerType, TeamType } from '../dtos';

// TODO Perhaps avoid gathering all data at once and passing it around, to reduce memory cost?
export type PlayerTypeImportData = {
  playerType: PlayerType;
  teamTypes: TeamType[];
  advancements: Advancement[];
};

@Injectable()
export class PlayerTypesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly advancementService: AdvancementsService,
    private readonly teamTypesService: TeamTypesService,
  ) {}

  getPlayerTypes(): PlayerTypeImportData[] {
    // Loop over all the player type files in the directory
    const playerTypes = Array<PlayerTypeImportData>();
    const playerTypeFilenames = this.fileReaderService
      .listFiles('default.asp?p=pt&typID=')
      .concat(this.fileReaderService.listFiles('default.asp?p=pt&typid='));
    for (const playerTypeFilename of playerTypeFilenames) {
      let playerTypeId;
      if (playerTypeFilename.indexOf('&typ=') >= 0) {
        const firstSlice = playerTypeFilename.slice(
          0,
          playerTypeFilename.indexOf('&typ='),
        );
        playerTypeId = firstSlice.slice(firstSlice.lastIndexOf('=') + 1);
      } else {
        playerTypeId = playerTypeFilename.slice(
          playerTypeFilename.lastIndexOf('=') + 1,
        );
      }
      const playerTypeFile =
        this.fileReaderService.readFile(playerTypeFilename);
      // Find player type name
      const playerTypeNameElements = playerTypeFile.querySelectorAll('h1');
      if (playerTypeNameElements.length != 1) {
        throw new Error(
          `Did not expect to find ${playerTypeNameElements.length} name elements for player type ${playerTypeId}`,
        );
      }
      const playerTypeName = playerTypeNameElements[0].innerText;
      // Find advancements
      const advancements = Array<Advancement>();
      const advancementElements = playerTypeFile.querySelectorAll(
        'table.tblist td.rtd9',
      );
      for (const advancementElement of advancementElements) {
        if (advancementElement.innerText) {
          for (const advancementText of advancementElement.innerText.split(
            ',',
          )) {
            const trimmedAdvancementText = advancementText
              .replace('&nbsp;', '')
              .trim();
            if (trimmedAdvancementText) {
              advancements.push({
                externalIds: [this.api.externalId(trimmedAdvancementText)],
                name: trimmedAdvancementText,
              });
            }
          }
        }
      }
      // Find team types
      const teamTypes = Array<TeamType>();
      const teamTypeElements = playerTypeFile.querySelectorAll(
        'table.tblist td.small a',
      );
      for (const teamTypeElement of teamTypeElements) {
        teamTypes.push({
          externalIds: [
            this.api.externalId(
              this.fileReaderService.findAnchorInHref(
                teamTypeElement.getAttribute('href'),
              ),
            ),
          ],
          name: teamTypeElement.innerText,
        });
      }
      // Assemble the result
      playerTypes.push({
        playerType: {
          externalIds: [this.api.externalId(playerTypeId)],
          name: playerTypeName,
        },
        teamTypes: teamTypes,
        advancements: advancements,
      });
    }
    return playerTypes;
  }

  async uploadPlayerTypes(playerTypes: PlayerTypeImportData[]): Promise<void> {
    for (const playerType of playerTypes) {
      await this.uploadPlayerType(playerType);
    }
  }

  private uploadedPlayerTypes = Array<string>();
  async uploadPlayerType(data: PlayerTypeImportData): Promise<void> {
    // Ensure no duplicate uploads
    if (
      this.uploadedPlayerTypes.indexOf(
        this.api.getExternalId(data.playerType),
      ) != -1
    ) {
      return;
    }
    this.uploadedPlayerTypes.push(this.api.getExternalId(data.playerType));
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole player type
    // Upload the player type data
    const result = await this.api.post('player-type', data.playerType);
    console.log(JSON.stringify(result.data));
    for (const advancement of data.advancements) {
      await this.advancementService.uploadAdvancement(advancement);
    }
    for (const advancement of data.advancements) {
      const advancementResult = await this.api.post(
        'player-type-has-advancement',
        {
          playerType: data.playerType,
          advancement: advancement,
        },
      );
      console.log(JSON.stringify(advancementResult.data));
    }
    for (const teamType of data.teamTypes) {
      await this.teamTypesService.uploadTeamType(teamType);
      const teamTypeResult = await this.api.post('player-type-in-team-type', {
        playerType: data.playerType,
        teamType: teamType,
      });
      console.log(JSON.stringify(teamTypeResult.data));
    }
  }
}
