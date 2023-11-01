import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, Match } from '../dtos';
import { MatchImportService } from '../import/match-import.service';
import { MatchService } from '../persistence/match.service';

@Resolver(() => Match)
export class MatchResolver {
  constructor(
    private matchImportService: MatchImportService,
    private matchService: MatchService,
  ) {}

  @Mutation(() => Match, { name: 'match' })
  async importMatch(
    @Args('match', { type: () => Match }) match: Match,
  ): Promise<Match> {
    return this.matchImportService.import(match);
  }

  @Query(() => Match)
  async match(@Args('id', { type: () => Int }) id: number): Promise<Match> {
    return this.matchService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() match: Match): ExternalId[] {
    return match.externalIds;
  }
}
