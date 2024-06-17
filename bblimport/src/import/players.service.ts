import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblTeamReference } from './teams.service';
import { HTMLElement } from 'node-html-parser';
import { BblPlayerTypeReference } from './player-types.service';
import { AdvancementsService, BblAdvancement } from './advancements.service';

export type BblPlayerReference = {
  id: string;
};

export type BblPlayer = BblPlayerReference & {
  name: string;
  playerType: BblPlayerTypeReference;
  team: BblTeamReference;
  advancements: BblAdvancement[];
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly advancementService: AdvancementsService,
    private readonly api: ApiClientService,
  ) {}

  getPlayers(): BblPlayer[] {
    // Loop over all the match files in the directory
    const players = Array<BblPlayer>();
    const playerFilenames = this.fileReaderService.listFiles(
      'default.asp?p=pl&pid=',
    );
    for (const playerFilename of playerFilenames) {
      const playerId = playerFilename.slice(
        playerFilename.lastIndexOf('=') + 1,
      );
      const playerFile = this.fileReaderService.readFile(playerFilename);
      // Find player name
      const nameAndStatusElements =
        playerFile.querySelectorAll('td.small div b');
      if (
        nameAndStatusElements.length < 1 ||
        nameAndStatusElements.length > 2
      ) {
        throw new Error(
          `Did not expect to find ${nameAndStatusElements.length} name/status elements for player ${playerId}`,
        );
      }
      const playerName = nameAndStatusElements[0].innerText;
      // TODO Also extract player status from the second element (note that journeymen may not have a status element)
      // Find player type
      const playerElement = nameAndStatusElements[0].parentNode.parentNode;
      const playerLinkElements = playerElement.childNodes
        .filter((childNode) => childNode instanceof HTMLElement)
        .map((childNode) => childNode as HTMLElement)
        .filter((childElement) => childElement.tagName === 'A');
      if (playerLinkElements.length != 2) {
        throw new Error(
          `Did not expect to find ${playerLinkElements.length} type/team elements for player ${playerId}`,
        );
      }
      const playerType = {
        id: this.fileReaderService.findQueryParamInHref(
          'typID',
          playerLinkElements[0].getAttribute('href'),
        ),
      };
      // Find team
      const team = {
        id: this.fileReaderService.findQueryParamInHref(
          't',
          playerLinkElements[1].getAttribute('href'),
        ),
      };
      // Find advancements
      const advancements = Array<BblAdvancement>();
      const advancementElements = playerFile.querySelectorAll(
        'table.tblist td.rtd9 span',
      );
      for (const advancementElement of advancementElements) {
        if (advancementElement.innerText) {
          const trimmedText = advancementElement.innerText.trim();
          if (trimmedText != '?') {
            advancements.push({
              name: trimmedText,
            });
          }
        }
      }
      // Find sustained injuries
      // TODO Find sustained injuries by listing elements "table.tblist td.red3" and taking their innerText (ensure niggling injuries registered correctly, e.g. player 330)
      // Assemble the result
      players.push({
        id: playerId,
        name: playerName,
        playerType: playerType,
        team: team,
        advancements: advancements,
      });
    }
    return players;
  }

  async uploadPlayers(players: BblPlayer[]): Promise<void> {
    for (const player of players) {
      await this.uploadPlayer(player);
    }
  }

  async uploadPlayer(player: BblPlayer): Promise<void> {
    // TODO Ensure any sustained injuries have been uploaded before connecting players to them
    // Upload the player data
    const result = await this.api.post(
      'player',
      {
        name: player.name,
        externalIds: [this.api.externalId(player.id)],
        playerType: {
          externalIds: [this.api.externalId(player.playerType.id)],
        },
        team: {
          externalIds: [this.api.externalId(player.team.id)],
        },
      },
    );
    console.log(JSON.stringify(result.data));
    for (const advancement of player.advancements) {
      await this.advancementService.uploadAdvancement(advancement);
      const advancementResult = await this.api.mutation(
        'importPlayerHasAdvancement',
        'playerHasAdvancement',
        {
          player: {
            externalIds: [this.api.externalId(player.id)],
          },
          advancement: {
            externalIds: [this.api.externalId(advancement.name)],
          },
        },
        [
          'id',
          {
            player: [
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
