import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { BblCompetitionReference } from './competitions.service';
import { BblTeamReference } from './teams.service';
import { BblPlayerReference } from './players.service';
import { HTMLElement } from 'node-html-parser';

export enum ActionType {
  // Actions that give star player points
  CASUALTY = 'CASUALTY',
  COMPLETION = 'COMPLETION', // TODO Need separate (more specific) enum for ball completion? And the ability to have an unknown completion, for TourPlay?
  TTM_COMPLETION = 'TTM_COMPLETION',
  DEFLECTION = 'DEFLECTION',
  INTERCEPTION = 'INTERCEPTION',
  TOUCHDOWN = 'TOUCHDOWN',
  MVP = 'MVP',
  // Other actions
  FOUL = 'FOUL',
  SENT_OFF = 'SENT_OFF',
}

export enum ConsequenceType {
  // Serious injury can be either unspecified or specified
  SERIOUS_INJURY = 'SERIOUS_INJURY',
  MISS_NEXT_GAME = 'MISS_NEXT_GAME',
  NIGGLING_INJURY = 'NIGGLING_INJURY',
  MOVEMENT_REDUCTION = 'MOVEMENT_REDUCTION',
  STRENGTH_REDUCTION = 'STRENGTH_REDUCTION',
  AGILITY_REDUCTION = 'AGILITY_REDUCTION',
  PASSING_REDUCTION = 'PASSING_REDUCTION',
  ARMOUR_REDUCTION = 'ARMOUR_REDUCTION',
  // For other types of casualties, the consequences are known
  BADLY_HURT = 'BADLY_HURT',
  DEATH = 'DEATH',
}

export type BblMatchEventReference = {
  id: string;
};

export type BblMatchEvent = BblMatchEventReference & {
  actingTeam?: BblTeamReference;
  actingPlayer?: BblPlayerReference;
  actionType?: ActionType;
  consequenceTeam?: BblTeamReference;
  consequencePlayer?: BblPlayerReference;
  consequenceType?: ConsequenceType;
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
        const rowTypeText = matchReportColumnElements[1].innerText;
        matchEvents.push(
          ...this.extractMatchEvents(
            matchReportColumnElements[0],
            teams[0],
            rowTypeText,
            matchId,
          ),
        );
        matchEvents.push(
          ...this.extractMatchEvents(
            matchReportColumnElements[2],
            teams[1],
            rowTypeText,
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
    rowTypeText: string,
    matchId: string,
  ): BblMatchEvent[] {
    const matchEvents = Array<BblMatchEvent>();
    this.fileReaderService
      .split(columnElements.childNodes)
      .forEach((eventElements, index) => {
        // Skip elements that are just the empty image element (i.e. no event)
        if (
          eventElements.length === 1 &&
          eventElements[0] instanceof HTMLElement &&
          eventElements[0].tagName === 'IMG'
        ) {
          return;
        }
        // Parse the event
        const eventId = `M${matchId}-${team.id}-${rowTypeText}-#${index}`;
        // Parse event type
        let actionType: ActionType;
        let consequenceType: ConsequenceType;
        let isConsequenceRow: boolean = false;
        switch (rowTypeText) {
          case 'TD Scorers':
            actionType = ActionType.TOUCHDOWN;
            break;
          case 'Completions by':
            actionType = ActionType.COMPLETION;
            break;
          case 'TTM Completions by':
            actionType = ActionType.TTM_COMPLETION;
            break;
          case 'Interceptions by':
            actionType = ActionType.INTERCEPTION;
            break;
          case 'Deflections by':
            actionType = ActionType.DEFLECTION;
            break;
          case 'Foulers (no cas)':
            actionType = ActionType.FOUL;
            break;
          case 'Sent off':
            actionType = ActionType.SENT_OFF;
            break;
          case "Badly Hurt'ers":
            actionType = ActionType.CASUALTY;
            consequenceType = ConsequenceType.BADLY_HURT;
            break;
          case 'Serious/LastingHurters/Injurers':
            actionType = ActionType.CASUALTY;
            consequenceType = ConsequenceType.SERIOUS_INJURY; // Exact injury unknown
            break;
          case 'Killers':
            actionType = ActionType.CASUALTY;
            consequenceType = ConsequenceType.DEATH;
            break;
          case 'MVP awards to':
            actionType = ActionType.MVP;
            break;
          case 'Miss Next Game':
            consequenceType = ConsequenceType.MISS_NEXT_GAME;
            isConsequenceRow = true;
            break;
          case 'Niggling Injury':
            consequenceType = ConsequenceType.NIGGLING_INJURY;
            isConsequenceRow = true;
            break;
          case '-1 MA':
            consequenceType = ConsequenceType.MOVEMENT_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 ST':
            consequenceType = ConsequenceType.STRENGTH_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 AG':
            consequenceType = ConsequenceType.AGILITY_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 PA':
            consequenceType = ConsequenceType.PASSING_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 AV':
            consequenceType = ConsequenceType.ARMOUR_REDUCTION;
            isConsequenceRow = true;
            break;
          case 'Death':
            consequenceType = ConsequenceType.DEATH;
            isConsequenceRow = true;
            break;
          default:
            throw new Error(
              `Match ${matchId} has unknown match event row type text: ${rowTypeText}`,
            );
        }
        // TODO Event type sometimes changed by non-player text elements (e.g. for fouls, random events)
        // Find player ID, if any
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
        if (isConsequenceRow) {
          matchEvents.push({
            id: eventId,
            actionType: actionType,
            consequenceTeam: team,
            consequencePlayer: {
              id: playerId,
            },
            consequenceType: consequenceType,
          });
        } else {
          matchEvents.push({
            id: eventId,
            actingTeam: team,
            actingPlayer: {
              id: playerId,
            },
            actionType: actionType,
            consequenceType: consequenceType,
          });
        }
      });
    return matchEvents;
  }

  private consolidateMatchEvents(
    matchEvents: BblMatchEvent[],
  ): BblMatchEvent[] {
    // TODO Consolidate into a smaller set, joining events that belong together
    // TODO In case of serious injuries, the acting row's exact consequence will be unknown, but consolidate anyway (when possible)
    // TODO If the same player caused every injury of a severity level, consolidate to all the consequence rows
    // TODO If all serious injuries have the same consequence type (e.g. niggling), that information can be used to detail the acting players' actions
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
      'match',
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
        'teamInMatch',
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
        'matchEvent',
        'matchEvent',
        {
          // TODO Send action/consequence type to backend
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
