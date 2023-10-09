import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, MatchEvent } from '../dtos';
import { MatchEventImportService } from '../import/match-event-import.service';
import { MatchEventService } from '../persistence/match-event.service';

@Resolver(() => MatchEvent)
export class MatchEventResolver {
  constructor(
    private matchEventImportService: MatchEventImportService,
    private matchEventService: MatchEventService,
  ) {}

  @Mutation(() => MatchEvent)
  async importMatchEvent(
    @Args('matchEvent', { type: () => MatchEvent }) matchEvent: MatchEvent,
  ): Promise<MatchEvent> {
    return this.matchEventImportService.import(matchEvent);
  }

  @Query(() => MatchEvent)
  async matchEvent(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<MatchEvent> {
    return this.matchEventService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() matchEvent: MatchEvent): ExternalId[] {
    return matchEvent.externalIds;
  }
}
