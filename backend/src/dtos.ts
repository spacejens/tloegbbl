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

@InputType('TeamTypeReferenceInput')
@ObjectType()
export class TeamTypeReference extends ExternallyIdentifiable {}

@InputType('TeamTypeInput')
@ObjectType()
export class TeamType extends TeamTypeReference {
  @Field()
  name: string;
}

@InputType('TeamReferenceInput')
@ObjectType()
export class TeamReference extends ExternallyIdentifiable {}

@InputType('TeamInput')
@ObjectType()
export class Team extends TeamReference {
  @Field()
  name: string;
  @Field(() => CoachReference)
  headCoach: CoachReference;
  @Field(() => CoachReference, { nullable: true })
  coCoach?: CoachReference;
  @Field(() => TeamTypeReference)
  teamType: TeamTypeReference;
}

@InputType('CompetitionReferenceInput')
@ObjectType()
export class CompetitionReference extends ExternallyIdentifiable {}

@InputType('CompetitionInput')
@ObjectType()
export class Competition extends CompetitionReference {
  @Field()
  name: string;
}
