import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Competition, ExternalId } from '../dtos';
import { CompetitionImportService } from '../import/competition-import.service';
import { CompetitionService } from '../persistence/competition.service';

@Resolver(() => Competition)
export class CompetitionResolver {
  constructor(
    private competitionImportService: CompetitionImportService,
    private competitionService: CompetitionService,
  ) {}

  @Mutation(() => Competition, { name: 'competition' })
  async importCompetition(
    @Args('competition', { type: () => Competition }) competition: Competition,
  ): Promise<Competition> {
    return this.competitionImportService.import(competition);
  }

  @Query(() => Competition)
  async competition(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Competition> {
    return this.competitionService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() competition: Competition): ExternalId[] {
    return competition.externalIds;
  }
}
