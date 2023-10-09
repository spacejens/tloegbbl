import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExternalId, PlayerType } from '../dtos';
import { PlayerTypeImportService } from '../import/player-type-import.service';
import { PlayerTypeService } from '../persistence/player-type.service';

@Resolver(() => PlayerType)
export class PlayerTypeResolver {
  constructor(
    private playerTypeImportService: PlayerTypeImportService,
    private playerTypeService: PlayerTypeService,
  ) {}

  @Mutation(() => PlayerType)
  async importPlayerType(
    @Args('playerType', { type: () => PlayerType }) playerType: PlayerType,
  ): Promise<PlayerType> {
    return this.playerTypeImportService.import(playerType);
  }

  @Query(() => PlayerType)
  async playerType(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PlayerType> {
    return this.playerTypeService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() playerType: PlayerType): ExternalId[] {
    return playerType.externalIds;
  }
}
