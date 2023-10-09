import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlayerHasAdvancement } from '../dtos';
import { PlayerHasAdvancementImportService } from '../import/player-has-advancement-import.service';
import { PlayerHasAdvancementService } from '../persistence/player-has-advancement.service';

@Resolver(() => PlayerHasAdvancement)
export class PlayerHasAdvancementResolver {
  constructor(
    private playerHasAdvancementImportService: PlayerHasAdvancementImportService,
    private playerHasAdvancementService: PlayerHasAdvancementService,
  ) {}

  @Mutation(() => PlayerHasAdvancement)
  async importPlayerHasAdvancement(
    @Args('playerHasAdvancement', { type: () => PlayerHasAdvancement })
    playerHasAdvancement: PlayerHasAdvancement,
  ): Promise<PlayerHasAdvancement> {
    return this.playerHasAdvancementImportService.import(playerHasAdvancement);
  }

  @Query(() => PlayerHasAdvancement)
  async playerHasAdvancement(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PlayerHasAdvancement> {
    return this.playerHasAdvancementService.findById(id);
  }
}
