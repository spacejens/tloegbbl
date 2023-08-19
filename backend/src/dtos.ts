import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExternalId {
  @Field((type) => Int)
  id?: number;
  @Field()
  externalId: string;
  @Field()
  externalSystem: string;
}

@ObjectType()
export class CoachReference {
  @Field((type) => Int)
  id?: number;
  @Field((type) => [ExternalId])
  externalIds?: ExternalId[];
}

@ObjectType()
export class Coach extends CoachReference {
  @Field()
  name: string;
}
