import {
  MatchEventActionType,
  MatchEventConsequenceType,
} from '@prisma/client';

export class Identifiable {
  id?: number;
}

export class ExternalId {
  id?: number;
  externalId: string;
  externalSystem: string;
}

export class ExternallyIdentifiable extends Identifiable {
  externalIds?: ExternalId[];
}

export class CoachReference extends ExternallyIdentifiable {}

export class Coach extends CoachReference {
  name: string;
}

export class TeamTypeReference extends ExternallyIdentifiable {}

export class TeamType extends TeamTypeReference {
  name: string;
  // TODO Include array of PlayerTypeInTeamType records? Or should API instead query using a partial PlayerTypeInTeamTypeReference?
}

export class TeamReference extends ExternallyIdentifiable {}

export class Team extends TeamReference {
  name: string;
  headCoach: CoachReference;
  coCoach?: CoachReference;
  teamType: TeamTypeReference;
  // TODO Include array of TeamInCompetitionReference records? Or should API instead query using a partial TeamInCompetitionReference?
  // TODO Include array of TeamInMatchReference records? Or should API instead query using a partial TeamInMatchReference?
}

export class AdvancementReference extends ExternallyIdentifiable {}

export class Advancement extends AdvancementReference {
  name: string;
  // TODO Include array of PlayerHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
  // TODO Include array of PlayerTypeHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

export class PlayerTypeReference extends ExternallyIdentifiable {}

export class PlayerType extends PlayerTypeReference {
  name: string;
  // TODO Include array of PlayerTypeInTeamType records? Or should API instead query using a partial PlayerTypeInTeamTypeReference?
  // TODO Include array of PlayerTypeHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

export class PlayerTypeInTeamTypeReference extends Identifiable {
  playerType?: PlayerTypeReference;
  teamType?: TeamTypeReference;
}

export class PlayerTypeInTeamType extends PlayerTypeInTeamTypeReference {}

export class PlayerTypeHasAdvancementReference extends Identifiable {
  playerType?: PlayerTypeReference;
  advancement?: AdvancementReference;
}

export class PlayerTypeHasAdvancement extends PlayerTypeHasAdvancementReference {}

export class PlayerReference extends ExternallyIdentifiable {}

export class Player extends PlayerReference {
  name: string;
  playerType: PlayerTypeReference;
  team: TeamReference;
  // TODO Include array of PlayerHasAdvancement records? Or should API instead query using a partial PlayerHasAdvancementReference?
}

export class PlayerHasAdvancementReference extends Identifiable {
  player?: PlayerReference;
  advancement?: AdvancementReference;
}

export class PlayerHasAdvancement extends PlayerHasAdvancementReference {}

export class CompetitionReference extends ExternallyIdentifiable {}

export class Competition extends CompetitionReference {
  name: string;
  // TODO Include array of TeamInCompetitionReference records? Or should API instead query using a partial TeamInCompetitionReference?
  // TODO Include array of MatchReference records? Or should API instead query using a partial MatchReference?
}

export class TeamInCompetitionReference extends Identifiable {
  team?: TeamReference;
  competition?: CompetitionReference;
}

export class TeamInCompetition extends TeamInCompetitionReference {}

export class MatchReference extends ExternallyIdentifiable {}

export class Match extends MatchReference {
  name: string;
  competition: CompetitionReference;
  // TODO Include array of TeamInMatchReference records? Or should API instead query using a partial TeamInMatchReference?
}

export class TeamInMatchReference extends Identifiable {
  team?: TeamReference;
  match?: MatchReference;
}

export class TeamInMatch extends TeamInMatchReference {}

export class MatchEventReference extends ExternallyIdentifiable {}

export class MatchEvent extends MatchEventReference {
  match: MatchReference;
  actingTeam?: TeamReference;
  actingPlayer?: PlayerReference;
  actionType?: MatchEventActionType;
  consequenceTeam?: TeamReference;
  consequencePlayer?: PlayerReference;
  consequenceType?: MatchEventConsequenceType;
}
