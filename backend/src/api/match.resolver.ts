import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Match } from '../dtos';
import { MatchImportService } from '../import/match-import.service';

@Resolver(() => Match)
export class MatchResolver {
  constructor(private matchImportService: MatchImportService) {}

  @Mutation(() => Match)
  async importMatch(
    @Args('match', { type: () => Match }) match: Match,
  ): Promise<Match> {
    return this.matchImportService.import(match);
  }
}
