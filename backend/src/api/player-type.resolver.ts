import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlayerType } from '../dtos';
import { PlayerTypeImportService } from '../import/player-type-import.service';

@Resolver(() => PlayerType)
export class PlayerTypeResolver {
  constructor(private playerTypeImportService: PlayerTypeImportService) {}

  @Mutation(() => PlayerType)
  async importPlayerType(
    @Args('playerType', { type: () => PlayerType }) playerType: PlayerType,
  ): Promise<PlayerType> {
    return this.playerTypeImportService.import(playerType);
  }
}
