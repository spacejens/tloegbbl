import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CoachService } from '../persistence/coach.service';
import { Coach } from './coach.model';

@Resolver((of) => Coach)
export class CoachResolver {
  constructor(private coachService: CoachService) {}

  @Query((returns) => Coach, { nullable: true })
  async coach(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    const coach = await this.coachService.findCoachById(id);
    return (
      coach && {
        id: coach.id,
        name: coach.name,
      }
    );
  }
}
