import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlayerHasAdvancement } from '../dtos';
import { PlayerHasAdvancementImportService } from '../import/player-has-advancement-import.service';

@Resolver(() => PlayerHasAdvancement)
export class PlayerHasAdvancementResolver {
  constructor(
    private playerHasAdvancementImportService: PlayerHasAdvancementImportService,
  ) {}

  @Mutation(() => PlayerHasAdvancement)
  async importPlayerHasAdvancement(
    @Args('playerHasAdvancement', { type: () => PlayerHasAdvancement })
    playerHasAdvancement: PlayerHasAdvancement,
  ): Promise<PlayerHasAdvancement> {
    return this.playerHasAdvancementImportService.import(playerHasAdvancement);
  }
}
