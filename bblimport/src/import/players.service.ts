import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { HTMLElement } from 'node-html-parser';
import { AdvancementsService } from './advancements.service';
import {
  Advancement,
  Player,
  PlayerTypeReference,
  TeamReference,
} from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type PlayerImportData = {
  player: Player;
  advancements: Advancement[];
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly advancementService: AdvancementsService,
    private readonly api: ApiClientService,
    private readonly apiUtils: ApiUtilsService,
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
        externalIds: [
          this.apiUtils.externalId(
            this.fileReaderService.findQueryParamInHref(
              'typID',
              playerLinkElements[0].getAttribute('href'),
            ),
          ),
        ],
      };
      // Find team
      const team: TeamReference = {
        externalIds: [
          this.apiUtils.externalId(
            this.fileReaderService.findQueryParamInHref(
              't',
              playerLinkElements[1].getAttribute('href'),
            ),
          ),
        ],
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
            // TODO Handle if a player has the same advancement twice? (i.e. double stat increases)
            advancements.push({
              externalIds: [this.apiUtils.externalId(trimmedText)],
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
          externalIds: [this.apiUtils.externalId(playerId)],
          name: playerName,
          playerType: playerType,
          team: team,
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
    const result = await this.api.post('player', data.player);
    console.log(JSON.stringify(result.data));
    for (const advancement of data.advancements) {
      await this.advancementService.uploadAdvancement(advancement);
      const advancementResult = await this.api.post('player-has-advancement', {
        player: data.player,
        advancement: advancement,
      });
      console.log(JSON.stringify(advancementResult.data));
    }
  }
}
