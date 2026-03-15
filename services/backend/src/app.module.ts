import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersistenceModule } from './persistence/persistence.module';
import { ImportModule } from './import/import.module';
import { RestModule } from './rest/rest.module';
import { AppLoggerMiddleware } from './app-logger.middleware';

@Module({
  imports: [PersistenceModule, ImportModule, RestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('match-event'); // TODO Only apply logging where needed
  }
}
