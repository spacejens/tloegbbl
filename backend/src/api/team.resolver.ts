import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Team } from '../dtos';
import { TeamImportService } from '../import/team-import.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private teamImportService: TeamImportService) {}

  @Mutation(() => Team)
  async importTeam(
    @Args('team', { type: () => Team }) team: Team,
  ): Promise<Team> {
    return this.teamImportService.import(team);
  }
}
