import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblTeamReference } from './teams.service';
import { HTMLElement } from 'node-html-parser';
import { BblPlayerType, PlayerTypesService } from './player-types.service';

export type BblPlayerReference = {
  id: string;
};

export type BblPlayer = BblPlayerReference & {
  name: string;
  playerType: BblPlayerType;
  team: BblTeamReference;
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly playerTypeService: PlayerTypesService,
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
        name: playerLinkElements[0].innerText,
      };
      // Find team
      const team = {
        id: this.fileReaderService.findQueryParamInHref(
          't',
          playerLinkElements[1].getAttribute('href'),
        ),
      };
      // Find advancements
      // TODO Find advancements by listing elements "table.tblist td.rtd9 span" and taking their innerText (filtering out ? for unpicked skills)
      // Find sustained injuries
      // TODO Find sustained injuries by listing elements "table.tblist td.red3" and taking their innerText (ensure niggling injuries registered correctly, e.g. player 330)
      // Assemble the result
      players.push({
        id: playerId,
        name: playerName,
        playerType: playerType,
        team: team,
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
    await this.playerTypeService.uploadPlayerType(player.playerType);
    // TODO Ensure any used advancements have been uploaded before connecting players to them
    // TODO Ensure any sustained injuries have been uploaded before connecting players to them
    // Upload the player data
    const result = await this.api.mutation(
      'importPlayer',
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
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
        {
          playerType: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
        {
          team: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
      ],
    );
    console.log(JSON.stringify(result.data));
  }
}
