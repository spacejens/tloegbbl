import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    ImportModule,
  ],
})
export class AppModule {}
