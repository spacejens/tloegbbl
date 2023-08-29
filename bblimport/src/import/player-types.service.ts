import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { AdvancementsService, BblAdvancement } from './advancements.service';

export type BblPlayerTypeReference = {
  id: string;
};

export type BblPlayerType = BblPlayerTypeReference & {
  name: string;
  advancements: BblAdvancement[];
};

@Injectable()
export class PlayerTypesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly advancementService: AdvancementsService,
  ) {}

  getPlayerTypes(): BblPlayerType[] {
    // Loop over all the player type files in the directory
    // Ignoring files (with lowercase typid) only linked from team reference list, only interested in league relevant data
    const playerTypes = Array<BblPlayerType>();
    const playerTypeFilenames = this.fileReaderService.listFiles(
      'default.asp?p=pt&typID=',
    );
    for (const playerTypeFilename of playerTypeFilenames) {
      const playerTypeId = playerTypeFilename.slice(
        playerTypeFilename.lastIndexOf('=') + 1,
      );
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
      // TODO Also import which team types the player type can play for
      // Assemble the result
      playerTypes.push({
        id: playerTypeId,
        name: playerTypeName,
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
      'importPlayerType',
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
        'importPlayerTypeHasAdvancement',
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
  }
}
