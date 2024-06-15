/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Advancement = {
  __typename?: 'Advancement';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type AdvancementInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type AdvancementReference = {
  __typename?: 'AdvancementReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type AdvancementReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Coach = {
  __typename?: 'Coach';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type CoachInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type CoachReference = {
  __typename?: 'CoachReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CoachReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Competition = {
  __typename?: 'Competition';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type CompetitionInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type CompetitionReference = {
  __typename?: 'CompetitionReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CompetitionReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ExternalId = {
  __typename?: 'ExternalId';
  externalId: Scalars['String']['output'];
  externalSystem: Scalars['String']['output'];
  id?: Maybe<Scalars['Int']['output']>;
};

export type ExternalIdInput = {
  externalId: Scalars['String']['input'];
  externalSystem: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Match = {
  __typename?: 'Match';
  competition: CompetitionReference;
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type MatchEvent = {
  __typename?: 'MatchEvent';
  actingPlayer?: Maybe<PlayerReference>;
  actingTeam?: Maybe<TeamReference>;
  actionType?: Maybe<MatchEventActionType>;
  consequencePlayer?: Maybe<PlayerReference>;
  consequenceTeam?: Maybe<TeamReference>;
  consequenceType?: Maybe<MatchEventConsequenceType>;
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  match: MatchReference;
};

export enum MatchEventActionType {
  Casualty = 'CASUALTY',
  Completion = 'COMPLETION',
  Deflection = 'DEFLECTION',
  Foul = 'FOUL',
  Interception = 'INTERCEPTION',
  Mvp = 'MVP',
  SentOff = 'SENT_OFF',
  Touchdown = 'TOUCHDOWN',
  TtmCompletion = 'TTM_COMPLETION'
}

export enum MatchEventConsequenceType {
  AgilityReduction = 'AGILITY_REDUCTION',
  ArmourReduction = 'ARMOUR_REDUCTION',
  BadlyHurt = 'BADLY_HURT',
  Death = 'DEATH',
  MissNextGame = 'MISS_NEXT_GAME',
  MovementReduction = 'MOVEMENT_REDUCTION',
  NigglingInjury = 'NIGGLING_INJURY',
  PassingReduction = 'PASSING_REDUCTION',
  SeriousInjury = 'SERIOUS_INJURY',
  StrengthReduction = 'STRENGTH_REDUCTION'
}

export type MatchEventInput = {
  actingPlayer?: InputMaybe<PlayerReferenceInput>;
  actingTeam?: InputMaybe<TeamReferenceInput>;
  actionType?: InputMaybe<MatchEventActionType>;
  consequencePlayer?: InputMaybe<PlayerReferenceInput>;
  consequenceTeam?: InputMaybe<TeamReferenceInput>;
  consequenceType?: InputMaybe<MatchEventConsequenceType>;
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  match: MatchReferenceInput;
};

export type MatchInput = {
  competition: CompetitionReferenceInput;
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type MatchReference = {
  __typename?: 'MatchReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type MatchReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  advancement: Advancement;
  coach: Coach;
  competition: Competition;
  match: Match;
  matchEvent: MatchEvent;
  player: Player;
  playerHasAdvancement: PlayerHasAdvancement;
  playerType: PlayerType;
  playerTypeHasAdvancement: PlayerTypeHasAdvancement;
  playerTypeInTeamType: PlayerTypeInTeamType;
  team: Team;
  teamInCompetition: TeamInCompetition;
  teamInMatch: TeamInMatch;
  teamType: TeamType;
};


export type MutationAdvancementArgs = {
  advancement: AdvancementInput;
};


export type MutationCoachArgs = {
  coach: CoachInput;
};


export type MutationCompetitionArgs = {
  competition: CompetitionInput;
};


export type MutationMatchArgs = {
  match: MatchInput;
};


export type MutationMatchEventArgs = {
  matchEvent: MatchEventInput;
};


export type MutationPlayerArgs = {
  player: PlayerInput;
};


export type MutationPlayerHasAdvancementArgs = {
  playerHasAdvancement: PlayerHasAdvancementInput;
};


export type MutationPlayerTypeArgs = {
  playerType: PlayerTypeInput;
};


export type MutationPlayerTypeHasAdvancementArgs = {
  playerTypeHasAdvancement: PlayerTypeHasAdvancementInput;
};


export type MutationPlayerTypeInTeamTypeArgs = {
  playerTypeInTeamType: PlayerTypeInTeamTypeInput;
};


export type MutationTeamArgs = {
  team: TeamInput;
};


export type MutationTeamInCompetitionArgs = {
  teamInCompetition: TeamInCompetitionInput;
};


export type MutationTeamInMatchArgs = {
  teamInMatch: TeamInMatchInput;
};


export type MutationTeamTypeArgs = {
  teamType: TeamTypeInput;
};

export type Player = {
  __typename?: 'Player';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  playerType: PlayerTypeReference;
  team: TeamReference;
};

export type PlayerHasAdvancement = {
  __typename?: 'PlayerHasAdvancement';
  advancement?: Maybe<AdvancementReference>;
  id?: Maybe<Scalars['Int']['output']>;
  player?: Maybe<PlayerReference>;
};

export type PlayerHasAdvancementInput = {
  advancement?: InputMaybe<AdvancementReferenceInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  player?: InputMaybe<PlayerReferenceInput>;
};

export type PlayerInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  playerType: PlayerTypeReferenceInput;
  team: TeamReferenceInput;
};

export type PlayerReference = {
  __typename?: 'PlayerReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type PlayerReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type PlayerType = {
  __typename?: 'PlayerType';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type PlayerTypeHasAdvancement = {
  __typename?: 'PlayerTypeHasAdvancement';
  advancement?: Maybe<AdvancementReference>;
  id?: Maybe<Scalars['Int']['output']>;
  playerType?: Maybe<PlayerTypeReference>;
};

export type PlayerTypeHasAdvancementInput = {
  advancement?: InputMaybe<AdvancementReferenceInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  playerType?: InputMaybe<PlayerTypeReferenceInput>;
};

export type PlayerTypeInTeamType = {
  __typename?: 'PlayerTypeInTeamType';
  id?: Maybe<Scalars['Int']['output']>;
  playerType?: Maybe<PlayerTypeReference>;
  teamType?: Maybe<TeamTypeReference>;
};

export type PlayerTypeInTeamTypeInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  playerType?: InputMaybe<PlayerTypeReferenceInput>;
  teamType?: InputMaybe<TeamTypeReferenceInput>;
};

export type PlayerTypeInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type PlayerTypeReference = {
  __typename?: 'PlayerTypeReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type PlayerTypeReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  advancement: Advancement;
  coach?: Maybe<Coach>;
  coaches?: Maybe<Array<Coach>>;
  competition: Competition;
  match: Match;
  matchEvent: MatchEvent;
  player: Player;
  playerHasAdvancement: PlayerHasAdvancement;
  playerType: PlayerType;
  playerTypeHasAdvancement: PlayerTypeHasAdvancement;
  playerTypeInTeamType: PlayerTypeInTeamType;
  team: Team;
  teamInCompetition: TeamInCompetition;
  teamInMatch: TeamInMatch;
  teamType?: Maybe<TeamType>;
};


export type QueryAdvancementArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCoachArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCompetitionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMatchArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMatchEventArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerHasAdvancementArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerTypeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerTypeHasAdvancementArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerTypeInTeamTypeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeamArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeamInCompetitionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeamInMatchArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeamTypeArgs = {
  id: Scalars['Int']['input'];
};

export type Team = {
  __typename?: 'Team';
  coCoach?: Maybe<CoachReference>;
  externalIds?: Maybe<Array<ExternalId>>;
  headCoach: CoachReference;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  teamType: TeamTypeReference;
};

export type TeamInCompetition = {
  __typename?: 'TeamInCompetition';
  competition?: Maybe<CompetitionReference>;
  id?: Maybe<Scalars['Int']['output']>;
  team?: Maybe<TeamReference>;
};

export type TeamInCompetitionInput = {
  competition?: InputMaybe<CompetitionReferenceInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  team?: InputMaybe<TeamReferenceInput>;
};

export type TeamInMatch = {
  __typename?: 'TeamInMatch';
  id?: Maybe<Scalars['Int']['output']>;
  match?: Maybe<MatchReference>;
  team?: Maybe<TeamReference>;
};

export type TeamInMatchInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  match?: InputMaybe<MatchReferenceInput>;
  team?: InputMaybe<TeamReferenceInput>;
};

export type TeamInput = {
  coCoach?: InputMaybe<CoachReferenceInput>;
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  headCoach: CoachReferenceInput;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  teamType: TeamTypeReferenceInput;
};

export type TeamReference = {
  __typename?: 'TeamReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type TeamReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type TeamType = {
  __typename?: 'TeamType';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type TeamTypeInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type TeamTypeReference = {
  __typename?: 'TeamTypeReference';
  externalIds?: Maybe<Array<ExternalId>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type TeamTypeReferenceInput = {
  externalIds?: InputMaybe<Array<ExternalIdInput>>;
  id?: InputMaybe<Scalars['Int']['input']>;
};
