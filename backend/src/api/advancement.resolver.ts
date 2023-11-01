import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Advancement, ExternalId } from '../dtos';
import { AdvancementImportService } from '../import/advancement-import.service';
import { AdvancementService } from '../persistence/advancement.service';

@Resolver(() => Advancement)
export class AdvancementResolver {
  constructor(
    private advancementImportService: AdvancementImportService,
    private advancementService: AdvancementService,
  ) {}

  @Mutation(() => Advancement, { name: 'advancement' })
  async importAdvancement(
    @Args('advancement', { type: () => Advancement }) advancement: Advancement,
  ): Promise<Advancement> {
    return this.advancementImportService.import(advancement);
  }

  @Query(() => Advancement)
  async advancement(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Advancement> {
    return this.advancementService.findById(id);
  }

  @ResolveField()
  externalIds(@Parent() advancement: Advancement): ExternalId[] {
    return advancement.externalIds;
  }
}
