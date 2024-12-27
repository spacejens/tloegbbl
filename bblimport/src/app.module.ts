import { Module } from '@nestjs/common';
import { ImportModule } from './import/import.module';
import { SanityCheckModule } from './sanitycheck/sanitycheck.module';
import { ApiClientModule } from './api-client/api-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    ImportModule,
    SanityCheckModule,
    ApiClientModule,
  ],
})
export class AppModule {}
