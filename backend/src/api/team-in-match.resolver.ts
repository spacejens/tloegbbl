import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamInMatch } from '../dtos';
import { TeamInMatchImportService } from '../import/team-in-match-import.service';
import { TeamInMatchService } from '../persistence/team-in-match.service';

@Resolver(() => TeamInMatch)
export class TeamInMatchResolver {
  constructor(
    private teamInMatchImportService: TeamInMatchImportService,
    private teamInMatchService: TeamInMatchService,
  ) {}

  @Mutation(() => TeamInMatch, { name: 'teamInMatch' })
  async importTeamInMatch(
    @Args('teamInMatch', { type: () => TeamInMatch })
    teamInMatch: TeamInMatch,
  ): Promise<TeamInMatch> {
    return this.teamInMatchImportService.import(teamInMatch);
  }

  @Query(() => TeamInMatch)
  async teamInMatch(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamInMatch> {
    return this.teamInMatchService.findById(id);
  }
}
