import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('ExternalIdInput')
@ObjectType()
export class ExternalId {
  @Field(() => Int, { nullable: true })
  id?: number;
  @Field()
  externalId: string;
  @Field()
  externalSystem: string;
}

@InputType('ExternallyIdentifiableInput')
@ObjectType()
export class ExternallyIdentifiable {
  @Field(() => Int, { nullable: true })
  id?: number;
  @Field(() => [ExternalId], { nullable: true })
  externalIds?: ExternalId[];
}

@InputType('CoachReferenceInput')
@ObjectType()
export class CoachReference extends ExternallyIdentifiable {}

@InputType('CoachInput')
@ObjectType()
export class Coach extends CoachReference {
  @Field()
  name: string;
}
