import { Injectable } from '@nestjs/common';
import { BblMatchEvent } from './matches.service';

@Injectable()
export class MatchEventConsolidatorService {

  consolidateMatchEvents(
    matchEvents: BblMatchEvent[],
  ): BblMatchEvent[] {
    const output = Array<BblMatchEvent>();
    for (const matchEvent of matchEvents) {
      // TODO Consolidate into a smaller set, joining events that belong together
      // TODO In case of serious injuries, the acting row's exact consequence will be unknown, but consolidate anyway (when possible)
      // TODO If the same player caused every injury of a severity level, consolidate to all the consequence rows
      // TODO If all serious injuries have the same consequence type (e.g. niggling), that information can be used to detail the acting players' actions
      // TODO Avoid consolidation for matches that are linked to other matches (multiplayer games)
      output.push(matchEvent);
    };
    return matchEvents;
  }
}
