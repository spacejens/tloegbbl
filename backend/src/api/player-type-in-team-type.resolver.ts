import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlayerTypeInTeamType } from '../dtos';
import { PlayerTypeInTeamTypeImportService } from '../import/player-type-in-team-type-import.service';

@Resolver(() => PlayerTypeInTeamType)
export class PlayerTypeInTeamTypeResolver {
  constructor(
    private playerTypeInTeamTypeImportService: PlayerTypeInTeamTypeImportService,
  ) {}

  @Mutation(() => PlayerTypeInTeamType)
  async importPlayerTypeInTeamType(
    @Args('playerTypeInTeamType', { type: () => PlayerTypeInTeamType })
    playerTypeInTeamType: PlayerTypeInTeamType,
  ): Promise<PlayerTypeInTeamType> {
    return this.playerTypeInTeamTypeImportService.import(playerTypeInTeamType);
  }
}
