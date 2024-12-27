import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { HTMLElement } from 'node-html-parser';
import { MatchEventConsolidatorService } from './match-event-consolidator.service';
import {
  CompetitionReference,
  Match,
  MatchEvent,
  MatchEventActionType,
  MatchEventConsequenceType,
  TeamReference,
} from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

export type MatchImportData = {
  match: Match;
  teams: TeamReference[];
  matchEvents: MatchEvent[];
};

@Injectable()
export class MatchesService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly api: ApiClientService,
    private readonly apiUtils: ApiUtilsService,
    private readonly consolidator: MatchEventConsolidatorService,
  ) {}

  getMatches(): MatchImportData[] {
    // Loop over all the match files in the directory
    const matches = Array<MatchImportData>();
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
      const competition: CompetitionReference = {
        externalIds: [
          this.apiUtils.externalId(
            this.fileReaderService.findQueryParamInHref(
              's',
              competitionElements[0].getAttribute('href'),
            ),
          ),
        ],
      };
      // Find match name
      const competitionAndMatchName =
        competitionElements[0].parentNode.innerText;
      const matchName = competitionAndMatchName.slice(
        competitionAndMatchName.indexOf(', ') + 2,
      );
      // Find date of match
      const matchDates = matchFile.querySelectorAll('div')
        .filter((element) => element.innerText.startsWith('Result added '))
        .map((element) => element.innerText.substring('Result added '.length).trim());
      if (matchDates.length != 1) {
        throw new Error(`Did not expect to find ${matchDates.length} match dates for ${matchId}`);
      }
      const matchDate = this.fileReaderService.parseDateFromMonthDayYear(matchDates[0]);
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
      const teams = Array<TeamReference>();
      for (const teamLogoElement of teamLogoElements) {
        teams.push({
          externalIds: [
            this.apiUtils.externalId(
              this.fileReaderService.findQueryParamInHref(
                't',
                teamLogoElement.parentNode.getAttribute('href'),
              ),
            ),
          ],
        });
      }
      // Find match events
      const matchEvents = Array<MatchEvent>();
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
      // TODO Include matchDate in the pushed match data
      matches.push({
        match: {
          externalIds: [this.apiUtils.externalId(matchId)],
          name: matchName,
          competition: competition,
        },
        teams: teams,
        matchEvents: this.consolidator.consolidateMatchEvents(matchEvents),
      });
    }
    return matches;
  }

  private extractMatchEvents(
    columnElements: HTMLElement,
    team: TeamReference,
    rowTypeText: string,
    matchId: string,
  ): MatchEvent[] {
    const matchEvents = Array<MatchEvent>();
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
        const eventId = `M${matchId}-${this.apiUtils.getExternalId(team)}-${rowTypeText}-#${index}`;
        // Parse event type
        let actionType: MatchEventActionType;
        let consequenceType: MatchEventConsequenceType;
        let isConsequenceRow: boolean = false;
        switch (rowTypeText) {
          case 'TD Scorers':
            actionType = MatchEventActionType.TOUCHDOWN;
            break;
          case 'Completions by':
            actionType = MatchEventActionType.COMPLETION;
            break;
          case 'TTM Completions by':
            actionType = MatchEventActionType.TTM_COMPLETION;
            break;
          case 'Interceptions by':
            actionType = MatchEventActionType.INTERCEPTION;
            break;
          case 'Deflections by':
            actionType = MatchEventActionType.DEFLECTION;
            break;
          case 'Foulers (no cas)':
            actionType = MatchEventActionType.FOUL;
            break;
          case 'Sent off':
            actionType = MatchEventActionType.SENT_OFF;
            break;
          case "Badly Hurt'ers":
            actionType = MatchEventActionType.CASUALTY;
            consequenceType = MatchEventConsequenceType.BADLY_HURT;
            break;
          case 'Serious/Lasting\nHurters/Injurers':
          case 'Serious/LastingHurters/Injurers':
            actionType = MatchEventActionType.CASUALTY;
            consequenceType = MatchEventConsequenceType.SERIOUS_INJURY; // Exact injury unknown
            break;
          case 'Killers':
            actionType = MatchEventActionType.CASUALTY;
            consequenceType = MatchEventConsequenceType.DEATH;
            break;
          case 'MVP awards to':
            actionType = MatchEventActionType.MVP;
            break;
          case 'Miss Next Game':
            consequenceType = MatchEventConsequenceType.MISS_NEXT_GAME;
            isConsequenceRow = true;
            break;
          case 'Niggling Injury':
            consequenceType = MatchEventConsequenceType.NIGGLING_INJURY;
            isConsequenceRow = true;
            break;
          case '-1 MA':
            consequenceType = MatchEventConsequenceType.MOVEMENT_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 ST':
            consequenceType = MatchEventConsequenceType.STRENGTH_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 AG':
            consequenceType = MatchEventConsequenceType.AGILITY_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 PA':
            consequenceType = MatchEventConsequenceType.PASSING_REDUCTION;
            isConsequenceRow = true;
            break;
          case '-1 AV':
            consequenceType = MatchEventConsequenceType.ARMOUR_REDUCTION;
            isConsequenceRow = true;
            break;
          case 'Death':
            consequenceType = MatchEventConsequenceType.DEATH;
            isConsequenceRow = true;
            break;
          default:
            throw new Error(
              `Match ${matchId} has unknown match event row type text: ${rowTypeText}`,
            );
        }
        // The event type can be affected by specific text being present
        if (
          actionType === MatchEventActionType.CASUALTY &&
          eventElements.filter((element) => element.rawText === 'foul by ').length > 0
        ) {
          actionType = MatchEventActionType.FOUL;
        }
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
          // No player IDs found, extract other non-player information
          const nonPlayerText = eventElements
            .map((element) => element.rawText)
            .join();
          // TODO Remember and store the specifics of the non-player text somehow?
          switch(nonPlayerText) {
            case 'victim regenerated':
            case 'victim healed by apoth':
            case 'mercenary':
            case 'mercenary / star':
            case 'journeyman':
              // Cannot identify the specific player
              break;
            case 'mercenary / fans / random event':
            case 'fans / random event':
              // There may or may not have been a specific player (secret weapons, fans, and so on)
              break;
            case 'Extra shoot-out TD after tied overtime':
              // There was no specific player
              break;
            case 'foul':
              if (actionType === MatchEventActionType.CASUALTY) {
                actionType = MatchEventActionType.FOUL;
              }
              break;
            default:
              throw new Error(
                `Match ${matchId} has unknown match event non player text: ${nonPlayerText}`,
              );
          }
          playerId = undefined;
        }
        if (isConsequenceRow) {
          matchEvents.push({
            externalIds: [this.apiUtils.externalId(eventId)],
            match: {
              externalIds: [this.apiUtils.externalId(matchId)],
            },
            actionType: actionType,
            consequenceTeam: team,
            consequencePlayer: {
              externalIds: [this.apiUtils.externalId(playerId)],
            },
            consequenceType: consequenceType,
          });
        } else {
          matchEvents.push({
            externalIds: [this.apiUtils.externalId(eventId)],
            match: {
              externalIds: [this.apiUtils.externalId(matchId)],
            },
            actingTeam: team,
            actingPlayer: {
              externalIds: [this.apiUtils.externalId(playerId)],
            },
            actionType: actionType,
            consequenceType: consequenceType,
          });
        }
      });
    return matchEvents;
  }

  async uploadMatches(matches: MatchImportData[]): Promise<void> {
    for (const match of matches) {
      await this.uploadMatch(match);
    }
  }

  async uploadMatch(data: MatchImportData): Promise<void> {
    // Upload the match data
    const result = await this.api.post('match', data.match);
    console.log(JSON.stringify(result.data));
    for (const team of data.teams) {
      const teamResult = await this.api.post('team-in-match', {
        team: team,
        match: data.match,
      });
      console.log(JSON.stringify(teamResult.data));
    }
    for (const matchEvent of data.matchEvents) {
      const eventResult = await this.api.post('match-event', matchEvent);
      console.log(JSON.stringify(eventResult.data));
    }
  }
}
