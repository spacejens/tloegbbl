import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlayerTypeHasAdvancement } from '../dtos';
import { PlayerTypeHasAdvancementImportService } from '../import/player-type-has-advancement-import.service';
import { PlayerTypeHasAdvancementService } from '../persistence/player-type-has-advancement.service';

@Resolver(() => PlayerTypeHasAdvancement)
export class PlayerTypeHasAdvancementResolver {
  constructor(
    private playerTypeHasAdvancementImportService: PlayerTypeHasAdvancementImportService,
    private playerTypeHasAdvancementService: PlayerTypeHasAdvancementService,
  ) {}

  @Mutation(() => PlayerTypeHasAdvancement)
  async importPlayerTypeHasAdvancement(
    @Args('playerTypeHasAdvancement', { type: () => PlayerTypeHasAdvancement })
    playerTypeHasAdvancement: PlayerTypeHasAdvancement,
  ): Promise<PlayerTypeHasAdvancement> {
    return this.playerTypeHasAdvancementImportService.import(
      playerTypeHasAdvancement,
    );
  }

  @Query(() => PlayerTypeHasAdvancement)
  async playerTypeHasAdvancement(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PlayerTypeHasAdvancement> {
    return this.playerTypeHasAdvancementService.findById(id);
  }
}
