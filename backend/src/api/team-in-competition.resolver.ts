import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TeamInCompetition } from '../dtos';
import { TeamInCompetitionImportService } from '../import/team-in-competition-import.service';

@Resolver(() => TeamInCompetition)
export class TeamInCompetitionResolver {
  constructor(
    private teamInCompetitionImportService: TeamInCompetitionImportService,
  ) {}

  @Mutation(() => TeamInCompetition)
  async importTeamInCompetition(
    @Args('teamInCompetition', { type: () => TeamInCompetition })
    teamInCompetition: TeamInCompetition,
  ): Promise<TeamInCompetition> {
    return this.teamInCompetitionImportService.import(teamInCompetition);
  }
}
