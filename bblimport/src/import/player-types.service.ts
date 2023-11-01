import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { AdvancementsService, BblAdvancement } from './advancements.service';
import { BblTeamType, TeamTypesService } from './team-types.service';

export type BblPlayerTypeReference = {
  id: string;
};

export type BblPlayerType = BblPlayerTypeReference & {
  name: string;
  teamTypes: BblTeamType[];
  advancements: BblAdvancement[];
};

@Injectable()
export class PlayerTypesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly advancementService: AdvancementsService,
    private readonly teamTypesService: TeamTypesService,
  ) {}

  getPlayerTypes(): BblPlayerType[] {
    // Loop over all the player type files in the directory
    const playerTypes = Array<BblPlayerType>();
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
      const advancements = Array<BblAdvancement>();
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
                name: trimmedAdvancementText,
              });
            }
          }
        }
      }
      // Find team types
      const teamTypes = Array<BblTeamType>();
      const teamTypeElements = playerTypeFile.querySelectorAll(
        'table.tblist td.small a',
      );
      for (const teamTypeElement of teamTypeElements) {
        teamTypes.push({
          id: this.fileReaderService.findAnchorInHref(
            teamTypeElement.getAttribute('href'),
          ),
          name: teamTypeElement.innerText,
        });
      }
      // Assemble the result
      playerTypes.push({
        id: playerTypeId,
        name: playerTypeName,
        teamTypes: teamTypes,
        advancements: advancements,
      });
    }
    return playerTypes;
  }

  async uploadPlayerTypes(playerTypes: BblPlayerType[]): Promise<void> {
    for (const playerType of playerTypes) {
      await this.uploadPlayerType(playerType);
    }
  }

  private uploadedPlayerTypes = Array<string>();
  async uploadPlayerType(playerType: BblPlayerType): Promise<void> {
    // Ensure no duplicate uploads
    if (this.uploadedPlayerTypes.indexOf(playerType.id) != -1) {
      return;
    }
    this.uploadedPlayerTypes.push(playerType.id);
    // TODO Can the duplicate upload detection be more clean? Would be nice with an object equality check of the whole player type
    // Upload the player type data
    const result = await this.api.mutation(
      'playerType',
      'playerType',
      {
        name: playerType.name,
        externalIds: [this.api.externalId(playerType.id)],
      },
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
      ],
    );
    console.log(JSON.stringify(result.data));
    for (const advancement of playerType.advancements) {
      await this.advancementService.uploadAdvancement(advancement);
      const advancementResult = await this.api.mutation(
        'playerTypeHasAdvancement',
        'playerTypeHasAdvancement',
        {
          playerType: {
            externalIds: [this.api.externalId(playerType.id)],
          },
          advancement: {
            externalIds: [this.api.externalId(advancement.name)],
          },
        },
        [
          'id',
          {
            playerType: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            advancement: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
        ],
      );
      console.log(JSON.stringify(advancementResult.data));
    }
    for (const teamType of playerType.teamTypes) {
      await this.teamTypesService.uploadTeamType(teamType);
      const teamTypeResult = await this.api.mutation(
        'playerTypeInTeamType',
        'playerTypeInTeamType',
        {
          playerType: {
            externalIds: [this.api.externalId(playerType.id)],
          },
          teamType: {
            externalIds: [this.api.externalId(teamType.id)],
          },
        },
        [
          'id',
          {
            playerType: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            teamType: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
        ],
      );
      console.log(JSON.stringify(teamTypeResult.data));
    }
  }
}
