import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TeamInMatch } from '../dtos';
import { TeamInMatchImportService } from '../import/team-in-match-import.service';

@Resolver(() => TeamInMatch)
export class TeamInMatchResolver {
  constructor(private teamInMatchImportService: TeamInMatchImportService) {}

  @Mutation(() => TeamInMatch)
  async importTeamInMatch(
    @Args('teamInMatch', { type: () => TeamInMatch })
    teamInMatch: TeamInMatch,
  ): Promise<TeamInMatch> {
    return this.teamInMatchImportService.import(teamInMatch);
  }
}
