import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CoachService } from '../persistence/coach.service';
import { Coach, CoachInput, ExternalId } from '../dtos';

@Resolver((of) => Coach)
export class CoachResolver {
  constructor(private coachService: CoachService) {}

  @Mutation((returns) => Coach)
  import(@Args('coach', { type: () => CoachInput }) coach: CoachInput): Coach {
    /*
      TODO Remove this comment block once mutation query ready in code elsewhere
      Syntax for mutation query is like this:

      mutation {
        import(coach: {
          name:"Frodo"
        }) {
          id,
          name,
        }
      }
    */
    // TODO Implement importing in GraphQL
    return {
      ...coach,
      id: 647,
    };
  }

  @Query((returns) => Coach, { nullable: true })
  async coach(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    return this.coachService.findCoachById(id);
  }

  @ResolveField()
  externalIds(@Parent() coach: Coach): ExternalId[] {
    return coach.externalIds;
  }

  @Query((returns) => [Coach], { nullable: true })
  async coaches(): Promise<Coach[]> {
    // TODO Implement list operation in persistence layer
    return [
      await this.coachService.findCoachById(2),
      await this.coachService.findCoachById(3),
    ];
  }
}
