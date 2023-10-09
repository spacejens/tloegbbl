import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, Team } from '../dtos';
import { TeamImportService } from '../import/team-import.service';
import { TeamService } from '../persistence/team.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(
    private teamImportService: TeamImportService,
    private teamService: TeamService,
  ) {}

  @Mutation(() => Team)
  async importTeam(
    @Args('team', { type: () => Team }) team: Team,
  ): Promise<Team> {
    return this.teamImportService.import(team);
  }

  @Query(() => Team)
  async team(@Args('id', { type: () => Int }) id: number): Promise<Team> {
    return this.teamService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() team: Team): ExternalId[] {
    return team.externalIds;
  }
}
