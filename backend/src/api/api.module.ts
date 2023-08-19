import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CoachResolver } from './coach.resolver';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      path: 'api',
      graphiql: {
        defaultQuery: `
{
  coach(id: 2) {
    id,
    name,
  }
}
        `,
      },
      autoSchemaFile: true, // Auto-generate in-memory schema file, doesn't have source folder in Docker
    }),
    PersistenceModule,
  ],
  providers: [
    CoachResolver,
  ],
})
export class ApiModule {}
