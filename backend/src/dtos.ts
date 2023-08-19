import { Field, Int, ObjectType } from '@nestjs/graphql';

export class ExternalId {
  id?: number;
  externalId: string;
  externalSystem: string;
}

@ObjectType()
export class CoachReference {
  @Field((type) => Int)
  id?: number;
  externalIds?: ExternalId[];
}

@ObjectType()
export class Coach extends CoachReference {
  @Field()
  name: string;
}
