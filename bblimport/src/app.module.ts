import { Module } from '@nestjs/common';
import { ImportModule } from './import/import.module';
import { SanityCheckModule } from './sanitycheck/sanitycheck.module';
import { ApiClientModule } from './api-client/api-client.module';

@Module({
  imports: [ImportModule, SanityCheckModule, ApiClientModule],
})
export class AppModule {}
