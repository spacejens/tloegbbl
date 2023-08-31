import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CoachResolver } from './coach.resolver';
import { PersistenceModule } from '../persistence/persistence.module';
import { ImportModule } from '../import/import.module';
import { TeamTypeResolver } from './team-type.resolver';
import { TeamResolver } from './team.resolver';
import { CompetitionResolver } from './competition.resolver';
import { TeamInCompetitionResolver } from './team-in-competition.resolver';
import { MatchResolver } from './match.resolver';
import { TeamInMatchResolver } from './team-in-match.resolver';
import { PlayerResolver } from './player.resolver';
import { PlayerTypeResolver } from './player-type.resolver';
import { AdvancementResolver } from './advancement.resolver';
import { PlayerHasAdvancementResolver } from './player-has-advancement.resolver';
import { PlayerTypeHasAdvancementResolver } from './player-type-has-advancement.resolver';
import { PlayerTypeInTeamTypeResolver } from './player-type-in-team-type.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      path: 'api',
      graphiql: {
        defaultQuery: `{
  singleCoach: coach(id: 2) {
    id,
    externalIds {
      externalId,
      externalSystem,
    },
    name,
  }
  allCoaches: coaches {
    id,
    name,
  }
}`,
      },
      autoSchemaFile: true, // Auto-generate in-memory schema file, doesn't have source folder in Docker
    }),
    PersistenceModule,
    ImportModule,
  ],
  providers: [
    CoachResolver,
    TeamTypeResolver,
    TeamResolver,
    CompetitionResolver,
    TeamInCompetitionResolver,
    MatchResolver,
    TeamInMatchResolver,
    PlayerResolver,
    PlayerTypeResolver,
    AdvancementResolver,
    PlayerHasAdvancementResolver,
    PlayerTypeHasAdvancementResolver,
    PlayerTypeInTeamTypeResolver,
  ],
})
export class ApiModule {}
