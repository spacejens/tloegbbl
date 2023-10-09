import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamInCompetition } from '../dtos';
import { TeamInCompetitionImportService } from '../import/team-in-competition-import.service';
import { TeamInCompetitionService } from '../persistence/team-in-competition.service';

@Resolver(() => TeamInCompetition)
export class TeamInCompetitionResolver {
  constructor(
    private teamInCompetitionImportService: TeamInCompetitionImportService,
    private teamInCompetitionService: TeamInCompetitionService,
  ) {}

  @Mutation(() => TeamInCompetition)
  async importTeamInCompetition(
    @Args('teamInCompetition', { type: () => TeamInCompetition })
    teamInCompetition: TeamInCompetition,
  ): Promise<TeamInCompetition> {
    return this.teamInCompetitionImportService.import(teamInCompetition);
  }

  @Query(() => TeamInCompetition)
  async teamInCompetition(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamInCompetition> {
    return this.teamInCompetitionService.findById(id);
  }
}
