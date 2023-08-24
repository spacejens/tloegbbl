import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Competition } from '../dtos';
import { CompetitionImportService } from '../import/competition-import.service';

@Resolver(() => Competition)
export class CompetitionResolver {
  constructor(private competitionImportService: CompetitionImportService) {}

  @Mutation(() => Competition)
  async importCompetition(
    @Args('competition', { type: () => Competition }) competition: Competition,
  ): Promise<Competition> {
    return this.competitionImportService.import(competition);
  }
}
