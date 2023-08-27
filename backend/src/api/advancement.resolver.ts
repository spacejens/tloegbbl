import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Advancement } from '../dtos';
import { AdvancementImportService } from '../import/advancement-import.service';

@Resolver(() => Advancement)
export class AdvancementResolver {
  constructor(private advancementImportService: AdvancementImportService) {}

  @Mutation(() => Advancement)
  async importAdvancement(
    @Args('advancement', { type: () => Advancement }) advancement: Advancement,
  ): Promise<Advancement> {
    return this.advancementImportService.import(advancement);
  }
}
