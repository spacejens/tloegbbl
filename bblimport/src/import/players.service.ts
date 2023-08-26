import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblTeamReference } from './teams.service';
import { HTMLElement } from 'node-html-parser';

export type BblPlayerReference = {
  id: string;
};

export type BblPlayer = BblPlayerReference & {
  name: string;
  team: BblTeamReference;
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly fileReaderService: FileReaderService,
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
      // TODO Implement player type
      // Find team
      const team = {
        id: this.fileReaderService.findQueryParamInHref(
          't',
          playerLinkElements[1].getAttribute('href'),
        ),
      };
      // Assemble the result
      players.push({
        id: playerId,
        name: playerName,
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
    // TODO Upload player type
    // Upload the player data
    const result = await this.api.mutation(
      'importPlayer',
      'player',
      {
        name: player.name,
        externalIds: [this.api.externalId(player.id)],
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
