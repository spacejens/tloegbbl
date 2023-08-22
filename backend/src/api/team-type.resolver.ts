import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TeamType } from '../dtos';
import { TeamTypeImportService } from '../import/team-type-import.service';

@Resolver(() => TeamType)
export class TeamTypeResolver {
  constructor(private teamTypeImportService: TeamTypeImportService) {}

  @Mutation(() => TeamType)
  async importTeamType(
    @Args('teamType', { type: () => TeamType }) teamType: TeamType,
  ): Promise<TeamType> {
    return this.teamTypeImportService.import(teamType);
  }
}
