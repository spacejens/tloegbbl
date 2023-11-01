import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, TeamType } from '../dtos';
import { TeamTypeImportService } from '../import/team-type-import.service';
import { TeamTypeService } from '../persistence/team-type.service';

@Resolver(() => TeamType)
export class TeamTypeResolver {
  constructor(
    private teamTypeImportService: TeamTypeImportService,
    private teamTypeService: TeamTypeService,
  ) {}

  @Mutation(() => TeamType, { name: 'teamType' })
  async importTeamType(
    @Args('teamType', { type: () => TeamType }) teamType: TeamType,
  ): Promise<TeamType> {
    return this.teamTypeImportService.import(teamType);
  }

  @Query(() => TeamType, { nullable: true })
  async teamType(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamType> {
    return this.teamTypeService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() teamType: TeamType): ExternalId[] {
    return teamType.externalIds;
  }
}
