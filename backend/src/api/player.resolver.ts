import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Player } from '../dtos';
import { PlayerImportService } from '../import/player-import.service';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(private playerImportService: PlayerImportService) {}

  @Mutation(() => Player)
  async importPlayer(
    @Args('player', { type: () => Player }) player: Player,
  ): Promise<Player> {
    return this.playerImportService.import(player);
  }
}
