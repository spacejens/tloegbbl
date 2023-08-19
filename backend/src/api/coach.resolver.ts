import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CoachService } from '../persistence/coach.service';
import { Coach, ExternalId } from '../dtos';

@Resolver((of) => Coach)
export class CoachResolver {
  constructor(private coachService: CoachService) {}

  @Query((returns) => Coach, { nullable: true })
  async coach(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    return this.coachService.findCoachById(id);
  }

  @ResolveField()
  externalIds(@Parent() coach: Coach): ExternalId[] {
    return coach.externalIds;
  }
}
