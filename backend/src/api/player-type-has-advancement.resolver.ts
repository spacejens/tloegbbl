import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlayerTypeHasAdvancement } from '../dtos';
import { PlayerTypeHasAdvancementImportService } from '../import/player-type-has-advancement-import.service';

@Resolver(() => PlayerTypeHasAdvancement)
export class PlayerTypeHasAdvancementResolver {
  constructor(
    private playerTypeHasAdvancementImportService: PlayerTypeHasAdvancementImportService,
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
}
