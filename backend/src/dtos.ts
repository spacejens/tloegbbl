import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('Identifiable')
@ObjectType()
export class Identifiable {
  @Field(() => Int, { nullable: true })
  id?: number;
}

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
export class ExternallyIdentifiable extends Identifiable {
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
  // TODO Include array of TeamInCompetitionReference records? Or should API instead query using a partial TeamInCompetitionReference?
  // TODO Include array of TeamInMatchReference records? Or should API instead query using a partial TeamInMatchReference?
}

@InputType('AdvancementReferenceInput')
@ObjectType()
export class AdvancementReference extends ExternallyIdentifiable {}

@InputType('AdvancementInput')
@ObjectType()
export class Advancement extends AdvancementReference {
  @Field()
  name: string;
  // TODO Include array of PlayerHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
  // TODO Include array of PlayerTypeHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

@InputType('PlayerTypeReferenceInput')
@ObjectType()
export class PlayerTypeReference extends ExternallyIdentifiable {}

@InputType('PlayerTypeInput')
@ObjectType()
export class PlayerType extends PlayerTypeReference {
  @Field()
  name: string;
  // TODO Add many-to-many relation between player type and team type (explicit, to store e.g. number and cost of player type)
  // TODO Include array of PlayerTypeHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

@InputType('PlayerTypeHasAdvancementReferenceInput')
@ObjectType()
export class PlayerTypeHasAdvancementReference extends Identifiable {
  @Field(() => PlayerTypeReference, { nullable: true })
  playerType?: PlayerTypeReference;
  @Field(() => AdvancementReference, { nullable: true })
  advancement?: AdvancementReference;
}

@InputType('PlayerTypeHasAdvancementInput')
@ObjectType()
export class PlayerTypeHasAdvancement extends PlayerTypeHasAdvancementReference {}

@InputType('PlayerReferenceInput')
@ObjectType()
export class PlayerReference extends ExternallyIdentifiable {}

@InputType('PlayerInput')
@ObjectType()
export class Player extends PlayerReference {
  @Field()
  name: string;
  @Field(() => PlayerTypeReference)
  playerType: PlayerTypeReference;
  @Field(() => TeamReference)
  team: TeamReference;
  // TODO Include array of PlayerHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

@InputType('PlayerHasAdvancementReferenceInput')
@ObjectType()
export class PlayerHasAdvancementReference extends Identifiable {
  @Field(() => PlayerReference, { nullable: true })
  player?: PlayerReference;
  @Field(() => AdvancementReference, { nullable: true })
  advancement?: AdvancementReference;
}

@InputType('PlayerHasAdvancementInput')
@ObjectType()
export class PlayerHasAdvancement extends PlayerHasAdvancementReference {}

@InputType('CompetitionReferenceInput')
@ObjectType()
export class CompetitionReference extends ExternallyIdentifiable {}

@InputType('CompetitionInput')
@ObjectType()
export class Competition extends CompetitionReference {
  @Field()
  name: string;
  // TODO Include array of TeamInCompetitionReference records? Or should API instead query using a partial TeamInCompetitionReference?
  // TODO Include array of MatchReference records? Or should API instead query using a partial MatchReference?
}

@InputType('TeamInCompetitionReferenceInput')
@ObjectType()
export class TeamInCompetitionReference extends Identifiable {
  @Field(() => TeamReference, { nullable: true })
  team?: TeamReference;
  @Field(() => CompetitionReference, { nullable: true })
  competition?: CompetitionReference;
}

@InputType('TeamInCompetitionInput')
@ObjectType()
export class TeamInCompetition extends TeamInCompetitionReference {}

@InputType('MatchReferenceInput')
@ObjectType()
export class MatchReference extends ExternallyIdentifiable {}

@InputType('MatchInput')
@ObjectType()
export class Match extends MatchReference {
  @Field()
  name: string;
  @Field(() => CompetitionReference)
  competition: CompetitionReference;
  // TODO Include array of TeamInMatchReference records? Or should API instead query using a partial TeamInMatchReference?
}

@InputType('TeamInMatchReferenceInput')
@ObjectType()
export class TeamInMatchReference extends Identifiable {
  @Field(() => TeamReference, { nullable: true })
  team?: TeamReference;
  @Field(() => MatchReference, { nullable: true })
  match?: MatchReference;
}

@InputType('TeamInMatchInput')
@ObjectType()
export class TeamInMatch extends TeamInMatchReference {}
