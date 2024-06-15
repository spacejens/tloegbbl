import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
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
import { MatchEventResolver } from './match-event.resolver';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: 'api',
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          document: `{
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
        }),
      ],
      autoSchemaFile: join(process.cwd(), '../graphql-schema/backend.graphql'),
      sortSchema: true,
      introspection: true,
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
    MatchEventResolver,
  ],
})
export class ApiModule {}
