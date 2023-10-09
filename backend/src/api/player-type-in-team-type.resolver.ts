import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlayerTypeInTeamType } from '../dtos';
import { PlayerTypeInTeamTypeImportService } from '../import/player-type-in-team-type-import.service';
import { PlayerTypeInTeamTypeService } from '../persistence/player-type-in-team-type.service';

@Resolver(() => PlayerTypeInTeamType)
export class PlayerTypeInTeamTypeResolver {
  constructor(
    private playerTypeInTeamTypeImportService: PlayerTypeInTeamTypeImportService,
    private playerTypeInTeamTypeService: PlayerTypeInTeamTypeService,
  ) {}

  @Mutation(() => PlayerTypeInTeamType)
  async importPlayerTypeInTeamType(
    @Args('playerTypeInTeamType', { type: () => PlayerTypeInTeamType })
    playerTypeInTeamType: PlayerTypeInTeamType,
  ): Promise<PlayerTypeInTeamType> {
    return this.playerTypeInTeamTypeImportService.import(playerTypeInTeamType);
  }

  @Query(() => PlayerTypeInTeamType)
  async playerTypeInTeamType(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PlayerTypeInTeamType> {
    return this.playerTypeInTeamTypeService.findById(id);
  }
}
