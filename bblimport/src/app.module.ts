import { Module } from '@nestjs/common';
import { ImportModule } from './import/import.module';
import { SanityCheckModule } from './sanitycheck/sanitycheck.module';

@Module({
  imports: [ImportModule, SanityCheckModule],
})
export class AppModule {}
