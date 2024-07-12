import { Injectable } from '@nestjs/common';
import { ExternalId, ExternallyIdentifiable, MatchEvent, MatchEventActionType, MatchEventConsequenceType } from '../dtos';
import { ApiUtilsService } from '../api-client/api-utils.service';

@Injectable()
export class MatchEventConsolidatorService {
  constructor(
    private readonly apiUtils: ApiUtilsService,
  ) {}

  consolidateMatchEvents(matchEvents: MatchEvent[]): MatchEvent[] {
    const output = Array<MatchEvent>();
    const killers = Array<MatchEvent>();
    const deaths = Array<MatchEvent>();
    for (const matchEvent of matchEvents) {
      // TODO Consolidate into a smaller set, joining events that belong together
      if (matchEvent.actionType === MatchEventActionType.CASUALTY && matchEvent.consequenceType === MatchEventConsequenceType.DEATH) {
        killers.push(matchEvent);
      } else if (! matchEvent.actionType && matchEvent.consequenceType === MatchEventConsequenceType.DEATH) {
        deaths.push(matchEvent);
      } else {
        output.push(matchEvent);
      }
    }
    output.push(...this.mergeActionsWithConsequences(killers, deaths));
    return output;
  }

  mergeActionsWithConsequences(actions: MatchEvent[], consequences: MatchEvent[]): MatchEvent[] {
    return actions.concat(...consequences); // TODO Remove temporary return
    // TODO All actions by one team should merge with all consequences of other team(s)
    // TODO In case of serious injuries, the acting row's exact consequence will be unknown, but consolidate anyway (when possible)
    // TODO If the same player caused every injury of a severity level, consolidate to all the consequence rows
    // TODO If all serious injuries have the same consequence type (e.g. niggling), that information can be used to detail the acting players' actions
    // TODO Correctly handle consolidation for matches that are linked to other matches (multiplayer games)
  }

  mergeEvents(eventA: MatchEvent, eventB: MatchEvent): MatchEvent {
    // IDs
    // TODO Enable merging a new event with another that has a pre-existing ID
    // TODO Fail if both events have pre-existing IDs
    // External IDs
    let externalIds: ExternalId[] = [];
    if (eventA.externalIds) {
      externalIds = externalIds.concat(eventA.externalIds);
    }
    if (eventB.externalIds) {
      externalIds = externalIds.concat(eventB.externalIds);
    }
    // Match
    // TODO Fail if events are for different matches
    const match = eventA.match;
    // Acting team
    // TODO Fail if acting teams are both specified but different
    const actingTeam = eventA.actingTeam ?? eventB.actingTeam;
    // Acting player
    // TODO Fail if acting players are both specified but different
    const actingPlayer = eventA.actingPlayer ?? eventB.actingPlayer;
    // Action type
    // TODO Fail if action types are both specified but different
    const actionType = eventA.actionType ?? eventB.actionType;
    // Consequence team
    // TODO Fail if consequence teams are both specified but different
    const consequenceTeam = eventA.consequenceTeam ?? eventB.consequenceTeam;
    // Consequence player
    // TODO Fail if consequence players are both specified but different
    const consequencePlayer =
      eventA.consequencePlayer ?? eventB.consequencePlayer;
    // Consequence type
    // TODO Fail if consequence types are both specified but different
    const consequenceType = eventA.consequenceType ?? eventB.consequenceType;
    // Assemble and return
    return {
      externalIds: externalIds,
      match: match,
      actingTeam: actingTeam,
      actingPlayer: actingPlayer,
      actionType: actionType,
      consequenceTeam: consequenceTeam,
      consequencePlayer: consequencePlayer,
      consequenceType: consequenceType,
    };
  }

  // TODO What if there are multiple external IDs for the same data? Need to check for array overlap instead...
  sameExternalId(dataA: ExternallyIdentifiable, dataB: ExternallyIdentifiable): boolean {
    const idA = this.apiUtils.getExternalId(dataA);
    const idB = this.apiUtils.getExternalId(dataB);
    return idA && idA === idB;
  }
}
