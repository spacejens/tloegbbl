import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MatchEvent } from '../dtos';
import { MatchEventImportService } from '../import/match-event-import.service';

@Resolver(() => MatchEvent)
export class MatchEventResolver {
  constructor(private matchEventImportService: MatchEventImportService) {}

  @Mutation(() => MatchEvent)
  async importMatchEvent(
    @Args('matchEvent', { type: () => MatchEvent }) matchEvent: MatchEvent,
  ): Promise<MatchEvent> {
    return this.matchEventImportService.import(matchEvent);
  }
}
