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
import { Coach, ExternalId } from '../dtos';
import { CoachImportService } from '../import/coach-import.service';

@Resolver(() => Coach)
export class CoachResolver {
  constructor(
    private coachService: CoachService,
    private coachImportService: CoachImportService,
  ) {}

  @Mutation(() => Coach)
  async import(
    @Args('coach', { type: () => Coach }) coach: Coach,
  ): Promise<Coach> {
    /*
      TODO Remove this comment block once mutation query ready in code elsewhere
      Syntax for mutation query is like this:

      mutation {
        import(coach: {
          name:"Frodo",
          externalIds:[
            {
              externalId:"ExtId",
              externalSystem:"ExtSys",
            },
          ],
        }) {
          id,
          externalIds {
            id,
            externalId,
            externalSystem,
          },
          name,
        }
      }
    */
    return this.coachImportService.import(coach);
  }

  @Query(() => Coach, { nullable: true })
  async coach(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    return this.coachService.findCoachById(id);
  }

  @ResolveField()
  externalIds(@Parent() coach: Coach): ExternalId[] {
    return coach.externalIds;
  }

  @Query(() => [Coach], { nullable: true })
  async coaches(): Promise<Coach[]> {
    // TODO Implement list operation in persistence layer
    return [
      await this.coachService.findCoachById(2),
      await this.coachService.findCoachById(3),
    ];
  }
}
