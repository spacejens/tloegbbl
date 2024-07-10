import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { HTMLElement } from 'node-html-parser';
import { AdvancementsService } from './advancements.service';
import { Advancement, AdvancementReference, PlayerTypeReference, TeamReference } from '../dtos';

export type BblPlayerReference = {
  id: string;
};

export type BblPlayer = BblPlayerReference & {
  name: string;
  playerType: PlayerTypeReference;
  team: TeamReference;
  advancements: AdvancementReference[];
};

export type PlayerImportData = {
  player: BblPlayer,
  advancements: Advancement[],
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly advancementService: AdvancementsService,
    private readonly api: ApiClientService,
  ) {}

  getPlayers(): PlayerImportData[] {
    // Loop over all the match files in the directory
    const players = Array<PlayerImportData>();
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
      const playerType: PlayerTypeReference = {
        externalIds: [this.api.externalId(this.fileReaderService.findQueryParamInHref(
          'typID',
          playerLinkElements[0].getAttribute('href'),
        ))],
      };
      // Find team
      const team: TeamReference = {
        externalIds: [this.api.externalId(this.fileReaderService.findQueryParamInHref(
          't',
          playerLinkElements[1].getAttribute('href'),
        ))],
      };
      // Find advancements
      const advancements = Array<Advancement>();
      const advancementElements = playerFile.querySelectorAll(
        'table.tblist td.rtd9 span',
      );
      for (const advancementElement of advancementElements) {
        if (advancementElement.innerText) {
          const trimmedText = advancementElement.innerText.trim();
          if (trimmedText != '?') {
            advancements.push({
              externalIds: [this.api.externalId(trimmedText)],
              name: trimmedText,
            });
          }
        }
      }
      // Find sustained injuries
      // TODO Find sustained injuries by listing elements "table.tblist td.red3" and taking their innerText (ensure niggling injuries registered correctly, e.g. player 330)
      // Assemble the result
      players.push({
        player: {
          id: playerId,
          name: playerName,
          playerType: playerType,
          team: team,
          advancements: advancements,
        },
        advancements: advancements,
      });
    }
    return players;
  }

  async uploadPlayers(players: PlayerImportData[]): Promise<void> {
    for (const player of players) {
      await this.uploadPlayer(player);
    }
  }

  async uploadPlayer(data: PlayerImportData): Promise<void> {
    // TODO Ensure any sustained injuries have been uploaded before connecting players to them
    // Upload the player data
    const result = await this.api.post(
      'player',
      {
        name: data.player.name,
        externalIds: [this.api.externalId(data.player.id)],
        playerType: data.player.playerType,
        team: data.player.team,
      },
    );
    console.log(JSON.stringify(result.data));
    for (const advancement of data.advancements) {
      await this.advancementService.uploadAdvancement(advancement);
      const advancementResult = await this.api.post(
        'player-has-advancement',
        {
          player: {
            externalIds: [this.api.externalId(data.player.id)],
          },
          advancement: advancement,
        },
      );
      console.log(JSON.stringify(advancementResult.data));
    }
  }
}
