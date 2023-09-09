import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblCompetitionReference } from './competitions.service';
import { BblTeamReference } from './teams.service';
import { BblPlayerReference } from './players.service';
import { HTMLElement } from 'node-html-parser';

export type BblMatchEventReference = {
  id: string;
};

export type BblMatchEvent = BblMatchEventReference & {
  actingTeam?: BblTeamReference;
  actingPlayer?: BblPlayerReference;
  consequenceTeam?: BblTeamReference;
  consequencePlayer?: BblPlayerReference;
};

export type BblMatchReference = {
  id: string;
};

export type BblMatch = BblMatchReference & {
  name: string;
  competition: BblCompetitionReference;
  teams: BblTeamReference[];
  matchEvents: BblMatchEvent[];
};

@Injectable()
export class MatchesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
  ) {}

  getMatches(): BblMatch[] {
    // Loop over all the match files in the directory
    const matches = Array<BblMatch>();
    const matchFilenames =
      this.fileReaderService.listFiles('default.asp?p=m&m=');
    for (const matchFilename of matchFilenames) {
      const matchId = matchFilename.slice(matchFilename.lastIndexOf('=') + 1);
      const matchFile = this.fileReaderService.readFile(matchFilename);
      // Find competition
      const competitionElements = matchFile.querySelectorAll('td div b a');
      if (competitionElements.length != 1) {
        throw new Error(
          `Did not expect to find ${competitionElements.length} competition elements for ${matchId}`,
        );
      }
      const competition = {
        id: this.fileReaderService.findQueryParamInHref(
          's',
          competitionElements[0].getAttribute('href'),
        ),
      };
      // Find match name
      const competitionAndMatchName =
        competitionElements[0].parentNode.innerText;
      const matchName = competitionAndMatchName.slice(
        competitionAndMatchName.indexOf(', ') + 2,
      );
      // Find teams
      const teamLogoElements = matchFile.querySelectorAll(
        'tr.trborder td a img',
      );
      if (teamLogoElements.length != 2) {
        // BBL doesn't support matches with more than two teams
        throw new Error(
          `Did not expect to find ${teamLogoElements.length} teams for ${matchId}`,
        );
      }
      const teams = Array<BblTeamReference>();
      for (const teamLogoElement of teamLogoElements) {
        teams.push({
          id: this.fileReaderService.findQueryParamInHref(
            't',
            teamLogoElement.parentNode.getAttribute('href'),
          ),
        });
      }
      // Find match events
      const matchEvents = Array<BblMatchEvent>();
      const matchReportRowElements = matchFile.querySelectorAll(
        'table.tblist tr.trborder',
      );
      for (const matchReportRowElement of matchReportRowElements.slice(1)) {
        // First row is team logos, skipped it
        const matchReportColumnElements = matchReportRowElement.childNodes
          .filter((childNode) => childNode instanceof HTMLElement)
          .map((childNode) => childNode as HTMLElement)
          .filter((childElement) => childElement.tagName === 'TD');
        if (matchReportColumnElements.length != 3) {
          throw new Error(
            `Did not expect to find ${matchReportColumnElements.length} columns for match report row in match ${matchId}`,
          );
        }
        const eventType = matchReportColumnElements[1].innerText;
        // TODO Interpret the type of events (to an enum)
        // TODO Event type sometimes changed by text elements (e.g. for fouls)
        matchEvents.push(
          ...this.extractMatchEvents(
            matchReportColumnElements[0],
            teams[0],
            eventType,
            matchId,
          ),
        );
        matchEvents.push(
          ...this.extractMatchEvents(
            matchReportColumnElements[2],
            teams[1],
            eventType,
            matchId,
          ),
        );
      }
      // Assemble the result
      matches.push({
        id: matchId,
        name: matchName,
        competition: {
          id: competition.id,
        },
        teams: teams,
        matchEvents: this.consolidateMatchEvents(matchEvents),
      });
    }
    return matches;
  }

  // TODO Event type should be enum in function argument
  private extractMatchEvents(
    columnElements: HTMLElement,
    team: BblTeamReference,
    eventType: string,
    matchId: string,
  ): BblMatchEvent[] {
    const matchEvents = Array<BblMatchEvent>();
    this.fileReaderService
      .split(columnElements.childNodes)
      .forEach((eventElements, index) => {
        // TODO Skip eventElements that are just the empty image (i.e. no event)
        const eventId = `M${matchId}-T${team.id}-${eventType}-#${index}`;
        const playerIds = eventElements
          .filter((element) => element instanceof HTMLElement)
          .map((element) => element as HTMLElement)
          .filter((element) => element.tagName === 'A')
          .map((aTag) =>
            this.fileReaderService.findQueryParamInHref(
              'pid',
              aTag.getAttribute('href'),
            ),
          );
        let playerId: string;
        if (playerIds.length > 1) {
          throw new Error(
            `Did not expect multiple player links for event ${eventId}`,
          );
        } else if (playerIds.length === 1) {
          playerId = playerIds[0];
        } else {
          playerId = undefined;
        }
        // TODO For some event types, the report shows consequence team/player instead
        matchEvents.push({
          id: eventId,
          actingTeam: team,
          actingPlayer: {
            id: playerId,
          },
        });
      });
    // TODO Interpret other team's column as well (probably extract function and call it twice)
    return matchEvents;
  }

  private consolidateMatchEvents(
    matchEvents: BblMatchEvent[],
  ): BblMatchEvent[] {
    // TODO Consolidate into a smaller set, joining events that belong together
    // TODO Avoid consolidation for matches that are linked to other matches (multiplayer games)
    return matchEvents;
  }

  async uploadMatches(matches: BblMatch[]): Promise<void> {
    for (const match of matches) {
      await this.uploadMatch(match);
    }
  }

  async uploadMatch(match: BblMatch): Promise<void> {
    // Upload the match data
    const result = await this.api.mutation(
      'importMatch',
      'match',
      {
        name: match.name,
        externalIds: [this.api.externalId(match.id)],
        competition: {
          externalIds: [this.api.externalId(match.competition.id)],
        },
      },
      [
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
        {
          competition: [
            'id',
            {
              externalIds: ['id', 'externalId', 'externalSystem'],
            },
          ],
        },
      ],
    );
    console.log(JSON.stringify(result.data));
    for (const team of match.teams) {
      const teamResult = await this.api.mutation(
        'importTeamInMatch',
        'teamInMatch',
        {
          team: {
            externalIds: [this.api.externalId(team.id)],
          },
          match: {
            externalIds: [this.api.externalId(match.id)],
          },
        },
        [
          'id',
          {
            team: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            match: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
        ],
      );
      console.log(JSON.stringify(teamResult.data));
    }
    for (const matchEvent of match.matchEvents) {
      const eventResult = await this.api.mutation(
        'importMatchEvent',
        'matchEvent',
        {
          externalIds: [this.api.externalId(matchEvent.id)],
          match: {
            externalIds: [this.api.externalId(match.id)],
          },
          actingTeam: matchEvent.actingTeam
            ? {
                externalIds: [this.api.externalId(matchEvent.actingTeam.id)],
              }
            : undefined,
          actingPlayer: matchEvent.actingPlayer
            ? {
                externalIds: [this.api.externalId(matchEvent.actingPlayer.id)],
              }
            : undefined,
          consequenceTeam: matchEvent.consequenceTeam
            ? {
                externalIds: [
                  this.api.externalId(matchEvent.consequenceTeam.id),
                ],
              }
            : undefined,
          consequencePlayer: matchEvent.consequencePlayer
            ? {
                externalIds: [
                  this.api.externalId(matchEvent.consequencePlayer.id),
                ],
              }
            : undefined,
        },
        [
          'id',
          {
            externalIds: ['id', 'externalId', 'externalSystem'],
          },
          {
            match: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            actingTeam: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            actingPlayer: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            consequenceTeam: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
          {
            consequencePlayer: [
              'id',
              {
                externalIds: ['id', 'externalId', 'externalSystem'],
              },
            ],
          },
        ],
      );
      console.log(JSON.stringify(eventResult.data));
    }
  }
}
