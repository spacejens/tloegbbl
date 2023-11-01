import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, Player } from '../dtos';
import { PlayerImportService } from '../import/player-import.service';
import { PlayerService } from '../persistence/player.service';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(
    private playerImportService: PlayerImportService,
    private playerService: PlayerService,
  ) {}

  @Mutation(() => Player, { name: 'player' })
  async importPlayer(
    @Args('player', { type: () => Player }) player: Player,
  ): Promise<Player> {
    return this.playerImportService.import(player);
  }

  @Query(() => Player)
  async player(@Args('id', { type: () => Int }) id: number): Promise<Player> {
    return this.playerService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() player: Player): ExternalId[] {
    return player.externalIds;
  }
}
