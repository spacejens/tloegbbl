import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

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
export class ExternallyIdentifiable {
  @Field((type) => Int)
  id?: number;
  @Field((type) => [ExternalId])
  externalIds?: ExternalId[];
}

@ObjectType()
export class CoachReference extends ExternallyIdentifiable {}

@ObjectType()
export class Coach extends CoachReference {
  @Field()
  name: string;
}

@InputType()
export class CoachInput {
  // TODO Other properties of coach input should ideally be inherited
  @Field()
  name: string;
}
